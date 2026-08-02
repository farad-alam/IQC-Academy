import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_is_live' }
    });
    
    // Default to true if not set
    const isLive = setting ? setting.value === 'true' : true;
    
    return NextResponse.json({ isLive });
  } catch (error) {
    // Fail open if db error
    return NextResponse.json({ isLive: true });
  }
}
