import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET /api/admin/courses/[id]/subjects
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const subjects = await prisma.subject.findMany({
      where: { courseId },
      include: {
        _count: { select: { modules: true, finalExamQuizzes: true } }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('[ADMIN_SUBJECTS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/courses/[id]/subjects
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const { title, description, finalExamEnabled, finalExamPassMark, finalExamDisplayCount } = await req.json();

    if (!title?.trim()) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

    // Get next order number
    const lastSubject = await prisma.subject.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' }
    });
    const order = (lastSubject?.order ?? -1) + 1;

    const subject = await prisma.subject.create({
      data: {
        courseId,
        title: title.trim(),
        description: description?.trim() || null,
        order,
        finalExamEnabled: finalExamEnabled ?? false,
        finalExamPassMark: finalExamPassMark ? parseInt(finalExamPassMark) : 40,
        finalExamDisplayCount: finalExamDisplayCount ? parseInt(finalExamDisplayCount) : 20,
      }
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_SUBJECTS_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
