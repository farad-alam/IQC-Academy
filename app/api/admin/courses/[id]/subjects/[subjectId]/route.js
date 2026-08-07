import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - get a subject with its modules
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { _count: { select: { quizzes: true } } }
        },
        _count: { select: { finalExamQuizzes: true } }
      }
    });

    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    console.error('[ADMIN_SUBJECT_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH - update subject details or final exam config
export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    const body = await req.json();
    const { title, description, order, finalExamEnabled, finalExamPassMark, finalExamDisplayCount } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (order !== undefined) updateData.order = order;
    if (finalExamEnabled !== undefined) updateData.finalExamEnabled = finalExamEnabled;
    if (finalExamPassMark !== undefined) updateData.finalExamPassMark = parseInt(finalExamPassMark);
    if (finalExamDisplayCount !== undefined) updateData.finalExamDisplayCount = parseInt(finalExamDisplayCount);

    const subject = await prisma.subject.update({ where: { id: subjectId }, data: updateData });
    return NextResponse.json(subject);
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });
    console.error('[ADMIN_SUBJECT_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - delete subject (cascades modules, quizzes)
export async function DELETE(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { subjectId } = await params;
    await prisma.subject.delete({ where: { id: subjectId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });
    console.error('[ADMIN_SUBJECT_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
