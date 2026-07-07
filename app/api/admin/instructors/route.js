import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const instructors = await prisma.instructor.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, title: true, avatarUrl: true },
    });

    return NextResponse.json({ success: true, instructors });
  } catch (error) {
    console.error('[ADMIN_GET_INSTRUCTORS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, title, avatarUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'শিক্ষকের নাম আবশ্যক' }, { status: 400 });
    }

    const instructor = await prisma.instructor.create({
      data: { name: name.trim(), title: title || null, avatarUrl: avatarUrl || null },
    });

    return NextResponse.json({ success: true, instructor }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_CREATE_INSTRUCTOR_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
