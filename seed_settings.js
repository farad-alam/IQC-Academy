const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultSettings = [
  { key: 'site_is_live', value: 'true' },
  { key: 'bkash_number', value: '01712-345678' },
  { key: 'nagad_number', value: '01912-345678' },
  { key: 'rocket_number', value: '01512-345678-9' },
  { key: 'contact_phone', value: '+880 1700 000000' },
  { key: 'contact_whatsapp', value: '8801700000000' },
  { key: 'contact_email', value: 'info@iqcacademy.com' },
  { key: 'contact_address', value: 'ঢাকা, বাংলাদেশ' },
  { key: 'facebook_url', value: '#' },
  { key: 'youtube_url', value: '#' },
  { key: 'instagram_url', value: '#' },
  { key: 'twitter_url', value: '#' },
  { key: 'footer_tagline', value: 'কুরআন ও সুন্নাহর আলোকে জীবন গড়ার একটি নির্ভরযোগ্য প্রতিষ্ঠান।' },
  { key: 'google_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.0369448503!2d90.3671072!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1717600000000!5m2!1sen!2sbd' }
];

async function main() {
  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
