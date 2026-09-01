import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { getSiteSettings } from '@/lib/siteSettings';
import { setSiteLiveCache } from '@/lib/cache/siteLive';

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

    // Invalidate Redis cache if site_is_live was updated
    if ('site_is_live' in body) {
      await setSiteLiveCache(body.site_is_live === 'true' || body.site_is_live === true);
    }

    // Invalidate Next.js Server Components cache for settings and layout
    revalidateTag('settings');
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_SETTINGS_PUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
