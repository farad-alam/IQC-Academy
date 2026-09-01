import { redirect } from 'next/navigation';

export const revalidate = 3600;

export const metadata = {
  title: 'সদকাহ ও দান | IQC Academy',
};

export default async function DonatePage() {
  redirect('/projects');
}
