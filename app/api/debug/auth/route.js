import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/middleware/withAuth';

export async function GET() {
  try {
    const user = await getAuthUser();
    return NextResponse.json({
      user: user ? { id: user.id, email: user.email, role: user.role, status: user.status } : null,
      message: user ? 'Authenticated' : 'Not authenticated'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
