import prisma from './db';

const defaultSettings = {
  site_is_live: "true",
  individual_registration_open: "true",
  bkash_number: "01700000000",
  nagad_number: "01800000000",
  rocket_number: "01900000000",
  contact_phone: "+880 1700 000000",
  contact_whatsapp: "8801700000000",
  contact_email: "info@iqcacademy.com",
  contact_address: "ঢাকা, বাংলাদেশ",
  facebook_url: "#",
  youtube_url: "#",
  instagram_url: "#",
  twitter_url: "#",
  footer_tagline: "কুরআন ও সুন্নাহর আলোকে জীবন গড়ার একটি নির্ভরযোগ্য প্রতিষ্ঠান।",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.0369448503!2d90.3671072!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1717600000000!5m2!1sen!2sbd",
  deletion_security_key: ""
};

export async function getSiteSettings(keys = []) {
  try {
    const dbSettings = keys.length > 0
      ? await prisma.siteSetting.findMany({ where: { key: { in: keys } } })
      : await prisma.siteSetting.findMany();

    const settingsMap = {};
    dbSettings.forEach(s => { settingsMap[s.key] = s.value; });

    // Merge defaults with DB values (DB wins)
    const finalSettings = { ...defaultSettings, ...settingsMap };

    // If specific keys requested, return only those
    if (keys.length > 0) {
      const result = {};
      for (const key of keys) {
        result[key] = finalSettings[key] ?? null;
      }
      return result;
    }

    return finalSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return defaultSettings;
  }
}
