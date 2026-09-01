import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';

// Lightweight profile endpoint used only by TopNav.
// Returns ONLY the 3 fields the nav actually needs — no joins, no heavy queries.
export async function GET() {
  try {
    const token = await getAuthUser();
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: { name: true, email: true, role: true },
    });

    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
