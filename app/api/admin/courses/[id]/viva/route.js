import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// GET - list all viva scores for a course
export async function GET(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const vivaScores = await prisma.vivaScore.findMany({
      where: { courseId },
      include: { user: { select: { id: true, name: true, email: true, mobile: true } } },
      orderBy: { gradedAt: 'desc' }
    });

    return NextResponse.json(vivaScores);
  } catch (error) {
    console.error('[ADMIN_VIVA_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST/PATCH - set or update viva marks for a student in a course
export async function POST(req, { params }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const { userId, marks, remarks } = await req.json();

    if (!userId || marks === undefined) {
      return NextResponse.json({ error: 'userId and marks are required.' }, { status: 400 });
    }

    const vivaScore = await prisma.vivaScore.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        marks: parseInt(marks),
        remarks: remarks || null,
        gradedBy: admin.name || admin.email,
        gradedAt: new Date()
      },
      update: {
        marks: parseInt(marks),
        remarks: remarks || null,
        gradedBy: admin.name || admin.email,
        gradedAt: new Date()
      }
    });

    return NextResponse.json(vivaScore);
  } catch (error) {
    console.error('[ADMIN_VIVA_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
