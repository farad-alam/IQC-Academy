import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req, { params }) {
  try {
    const { id: courseId, moduleId } = params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId }
      }
    });

    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Not actively enrolled in this course' }, { status: 403 });
    }

    // 2. Verify module belongs to course
    const module = await prisma.module.findFirst({
      where: { id: moduleId, courseId }
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found in this course' }, { status: 404 });
    }

    // 3. Mark module as completed (use upsert to handle duplicates gracefully)
    await prisma.moduleCompletion.upsert({
      where: {
        userId_moduleId: { userId: user.id, moduleId }
      },
      update: {}, // Do nothing if it exists
      create: {
        userId: user.id,
        moduleId,
      }
    });

    // 4. Recalculate course progress
    const totalModules = await prisma.module.count({ where: { courseId } });
    const completedModules = await prisma.moduleCompletion.count({
      where: { 
        userId: user.id,
        module: { courseId }
      }
    });

    const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    let enrollStatus = 'ACTIVE';
    let completedAt = null;

    if (progress === 100) {
      enrollStatus = 'COMPLETED';
      completedAt = new Date();
    }

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { 
        progress, 
        completedModules,
        status: enrollStatus,
        completedAt
      }
    });

    return NextResponse.json({ 
      success: true, 
      progress,
      isCourseCompleted: progress === 100
    });

  } catch (error) {
    console.error('[MODULE_COMPLETE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
