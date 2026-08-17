const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const batches = await prisma.batch.findMany();
  if (batches.length === 0) {
    console.log("No batches found.");
    return;
  }
  
  const batchId = batches[0].id;
  console.log("Batch ID:", batchId);

  const batchStudents = await prisma.batchStudent.findMany({
    where: { batchId },
  });
  console.log("Batch Students:", batchStudents.length);

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
  const allModuleIds = batchCourses.flatMap(bc => bc.course.subjects.flatMap(s => s.modules.map(m => m.id)));
  const allSubjectIds = batchCourses.flatMap(bc => bc.course.subjects.map(s => s.id));
  
  console.log("Course IDs:", courseIds);
  console.log("Module IDs count:", allModuleIds.length);
  console.log("Subject IDs count:", allSubjectIds.length);

  const queryParams = {
    where: { batchId },
    orderBy: { enrolledAt: 'desc' },
    include: {
      user: {
        select: {
          id: true, name: true, email: true, mobile: true,
          institution: true, district: true, division: true,
          enrollments: courseIds.length > 0 ? {
            where: { courseId: { in: courseIds } },
            select: { courseId: true, status: true, progress: true, completedModules: true, enrolledAt: true }
          } : false,
          moduleCompletions: allModuleIds.length > 0 ? {
            where: { moduleId: { in: allModuleIds } },
            select: { moduleId: true, completedAt: true }
          } : false,
          subjectFinalExamSessions: allSubjectIds.length > 0 ? {
            where: { subjectId: { in: allSubjectIds } },
            select: { subjectId: true, score: true, total: true, passed: true, takenAt: true }
          } : false,
          vivaScores: courseIds.length > 0 ? {
            where: { courseId: { in: courseIds } },
            select: { courseId: true, marks: true, remarks: true, gradedAt: true }
          } : false,
        }
      }
    }
  };

  try {
    const students = await prisma.batchStudent.findMany(queryParams);
    console.log("Result length:", students.length);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

test().catch(console.error).finally(() => prisma.$disconnect());
