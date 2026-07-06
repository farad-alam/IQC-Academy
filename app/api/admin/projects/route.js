import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.description || !body.targetAmount || !body.category || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        targetAmount: parseFloat(body.targetAmount),
        category: body.category,
        location: body.location,
        icon: body.icon,
        imageUrl: body.imageUrl,
        deadline: body.deadline ? new Date(body.deadline) : null,
      }
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });

  } catch (error) {
    console.error('[ADMIN_CREATE_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
