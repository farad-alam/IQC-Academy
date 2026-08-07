import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import BatchDetailClient from './BatchDetailClient';

export const dynamic = 'force-dynamic';

export default async function AdminBatchDetailPage({ params }) {
  const { id } = await params;
  const batch = await prisma.batch.findUnique({ where: { id } });
  if (!batch) notFound();
  return <BatchDetailClient batch={batch} />;
}
