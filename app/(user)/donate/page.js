import { getSiteSettings } from '@/lib/siteSettings';
import DonateClient from './DonateClient';

export const metadata = {
  title: 'সদকাহ ও দান | IQC Academy',
};

export default async function DonatePage() {
  const settings = await getSiteSettings(['bkash_number', 'nagad_number', 'rocket_number']);
  return <DonateClient settings={settings} />;
}
