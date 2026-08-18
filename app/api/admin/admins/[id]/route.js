import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Prevent removing yourself
    if (user.id === id) {
      return NextResponse.json({ error: 'আপনি নিজেকে এডমিন থেকে সরাতে পারবেন না।' }, { status: 400 });
    }

    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'সুপার এডমিনকে সরানো যাবে না।' }, { status: 403 });
    }

    // Demote to STUDENT
    await prisma.user.update({
      where: { id },
      data: { role: 'STUDENT' }
    });

    return NextResponse.json({ success: true, message: 'এডমিন থেকে সরানো হয়েছে' });
  } catch (error) {
    console.error('[DELETE_ADMIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
