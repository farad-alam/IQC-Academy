import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/middleware/withAuth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type;
    const base64Data = `data:${mime};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const avatarUrl = await uploadImage(base64Data, 'iqc-academy/avatars');

    if (!avatarUrl) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Update User Profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
      select: { avatarUrl: true }
    });

    return NextResponse.json({ success: true, avatarUrl: updatedUser.avatarUrl });

  } catch (error) {
    console.error('[AVATAR_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
