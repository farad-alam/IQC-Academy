import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'সদকাহ ও দান | IQC Academy',
};

export default async function DonatePage() {
  redirect('/projects');
}
