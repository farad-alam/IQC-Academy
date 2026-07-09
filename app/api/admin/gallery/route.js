import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await prisma.galleryItem.findMany({
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[ADMIN_GET_GALLERY_ERROR]', error);
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
    const { title, type, date, file } = body;

    if (!title || !type || !date || !file) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImage(file, 'iqc-academy/gallery');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Save to DB
    const item = await prisma.galleryItem.create({
      data: {
        title,
        type,
        imageUrl,
        date: new Date(date)
      }
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('[ADMIN_POST_GALLERY_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
