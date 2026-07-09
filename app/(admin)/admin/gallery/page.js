import prisma from '@/lib/db';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const initialItems = await prisma.galleryItem.findMany({
    orderBy: { date: 'desc' }
  });

  // Prisma returns Date objects which cannot be passed directly to Client Components in Next.js without serialization, 
  // so we format them or parse them to ISO strings.
  const serializedItems = initialItems.map(item => ({
    ...item,
    date: item.date.toISOString(),
    createdAt: item.createdAt.toISOString()
  }));

  return <GalleryClient initialItems={serializedItems} />;
}
