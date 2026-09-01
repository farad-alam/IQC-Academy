import { redirect } from 'next/navigation';

export const revalidate = 300;

export const metadata = {
  title: 'সদকাহ ও দান | IQC Academy',
};

export default async function DonatePage() {
  redirect('/projects');
}
