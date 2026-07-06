import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  try {
    // 1. Fetch active projects
    const projects = await prisma.project.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        title: true,
        description: true,
        targetAmount: true,
        raisedAmount: true,
        icon: true,
        category: true,
        location: true,
        imageUrl: true,
        deadline: true,
        donorCount: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, projects });

  } catch (error) {
    console.error('[GET_PROJECTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
