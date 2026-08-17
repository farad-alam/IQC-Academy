import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export const dynamic = 'force-dynamic';

// GET /api/admin/batches/[id]/progress
// Returns deep progress data for every student in the batch
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: batchId } = await params;

    // 1. Get all courses assigned to this batch, along with their subjects and modules
    const batchCourses = await prisma.batchCourse.findMany({
      where: { batchId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subjects: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                order: true,
                finalExamEnabled: true,
                finalExamPassMark: true,
                modules: {
                  select: { id: true, title: true, order: true },
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    const courseIds = batchCourses.map(bc => bc.courseId);
    // Flat list of all module IDs across all batch courses
    const allModuleIds = batchCourses.flatMap(bc => bc.course.subjects.flatMap(s => s.modules.map(m => m.id)));
    // Flat list of all subject IDs
    const allSubjectIds = batchCourses.flatMap(bc => bc.course.subjects.map(s => s.id));

    // 2. Get all students in the batch with their progress data
    const batchStudents = await prisma.batchStudent.findMany({
      where: { batchId },
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, mobile: true,
            institution: true, district: true, division: true,
            // Course enrollments for batch courses
            enrollments: courseIds.length > 0 ? {
              where: { courseId: { in: courseIds } },
              select: { courseId: true, status: true, progress: true, completedModules: true, enrolledAt: true }
            } : false,
            // Subject final exam sessions for batch subjects
            subjectFinalExamSessions: allSubjectIds.length > 0 ? {
              where: { subjectId: { in: allSubjectIds } },
              select: { subjectId: true, score: true, total: true, passed: true, takenAt: true }
            } : false,
            // Viva scores for batch courses
            vivaScores: courseIds.length > 0 ? {
              where: { courseId: { in: courseIds } },
              select: { courseId: true, marks: true, remarks: true, gradedAt: true }
            } : false,
          }
        }
      }
    });

    const studentIds = batchStudents.map(bs => bs.userId);
    
    // Fetch module completions separately since the reverse relation isn't on User
    let allModuleCompletions = [];
    if (studentIds.length > 0 && allModuleIds.length > 0) {
      allModuleCompletions = await prisma.moduleCompletion.findMany({
        where: {
          userId: { in: studentIds },
          moduleId: { in: allModuleIds }
        },
        select: { userId: true, moduleId: true, completedAt: true }
      });
    }

    const STUCK_DAYS = 7;
    const now = new Date();

    // 3. Shape the response per student
    const result = batchStudents.map(bs => {
      const user = bs.user;
      const userCompletions = allModuleCompletions.filter(mc => mc.userId === user.id);
      const completionSet = new Set(userCompletions.map(mc => mc.moduleId));
      const examMap = Object.fromEntries(
        (user.subjectFinalExamSessions || []).map(s => [s.subjectId, s])
      );
      const enrollmentMap = Object.fromEntries(
        (user.enrollments || []).map(e => [e.courseId, e])
      );
      const vivaMap = Object.fromEntries(
        (user.vivaScores || []).map(v => [v.courseId, v])
      );

      // Last activity = most recent module completion or exam session
      const allDates = [
        ...(userCompletions || []).map(mc => new Date(mc.completedAt)),
        ...(user.subjectFinalExamSessions || []).map(s => new Date(s.takenAt)),
      ].filter(Boolean);
      const lastActivityAt = allDates.length > 0
        ? new Date(Math.max(...allDates.map(d => d.getTime())))
        : null;

      // Build per-course data
      const courses = batchCourses.map(bc => {
        const course = bc.course;
        const enrollment = enrollmentMap[course.id] || null;
        const viva = vivaMap[course.id] || null;

        const subjects = course.subjects.map(subject => {
          const modulesInSubject = subject.modules;
          const completedInSubject = modulesInSubject.filter(m => completionSet.has(m.id)).length;
          const examSession = examMap[subject.id] || null;

          return {
            subjectId: subject.id,
            title: subject.title,
            order: subject.order,
            totalModules: modulesInSubject.length,
            completedModules: completedInSubject,
            finalExam: subject.finalExamEnabled ? {
              enabled: true,
              taken: !!examSession,
              passed: examSession?.passed || false,
              score: examSession?.score || 0,
              total: examSession?.total || 0,
              passMark: subject.finalExamPassMark,
              takenAt: examSession?.takenAt || null,
            } : { enabled: false }
          };
        });

        const totalModules = course.subjects.reduce((sum, s) => sum + s.modules.length, 0);
        const completedModules = course.subjects.reduce(
          (sum, s) => sum + s.modules.filter(m => completionSet.has(m.id)).length, 0
        );

        return {
          courseId: course.id,
          title: course.title,
          enrolled: !!enrollment,
          totalModules,
          completedModules,
          progressPercent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
          enrolledAt: enrollment?.enrolledAt || null,
          subjects,
          vivaScore: viva ? { marks: viva.marks, remarks: viva.remarks, gradedAt: viva.gradedAt } : null,
        };
      });

      // Determine overall status
      const totalModulesAcrossAll = courses.reduce((sum, c) => sum + c.totalModules, 0);
      const completedModulesAcrossAll = courses.reduce((sum, c) => sum + c.completedModules, 0);
      let overallStatus;

      if (completedModulesAcrossAll === 0 && !lastActivityAt) {
        overallStatus = 'NOT_STARTED';
      } else if (totalModulesAcrossAll > 0 && completedModulesAcrossAll >= totalModulesAcrossAll) {
        overallStatus = 'COMPLETED';
      } else if (lastActivityAt) {
        const daysSinceActivity = (now - lastActivityAt) / (1000 * 60 * 60 * 24);
        overallStatus = daysSinceActivity > STUCK_DAYS ? 'STUCK' : 'IN_PROGRESS';
      } else {
        overallStatus = 'NOT_STARTED';
      }

      return {
        batchStudentId: bs.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        institution: user.institution,
        district: user.district,
        division: user.division,
        batchJoinedAt: bs.enrolledAt,
        lastActivityAt,
        overallStatus,
        totalModulesAcrossAll,
        completedModulesAcrossAll,
        overallProgressPercent: totalModulesAcrossAll > 0
          ? Math.round((completedModulesAcrossAll / totalModulesAcrossAll) * 100)
          : 0,
        courses,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[BATCH_PROGRESS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
