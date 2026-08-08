import prisma from '@/lib/db';
import AdminDonationsClient from '@/components/admin/AdminDonationsClient';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      project: { select: { id: true, title: true } },
      course: { select: { id: true, title: true } }
    }
  });

  const serialized = donations.map(d => ({
    ...d,
    amount: Number(d.amount),
    createdAt: d.createdAt.toISOString(),
    verifiedAt: d.verifiedAt?.toISOString() || null,
  }));

  return <AdminDonationsClient initialDonations={serialized} />;
}
