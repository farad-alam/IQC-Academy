import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { getSiteSettings } from '@/lib/siteSettings';

export async function GET(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[ADMIN_SETTINGS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    // UPSERT all keys
    const operations = Object.keys(body).map(key => {
      const value = String(body[key]);
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_SETTINGS_PUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
