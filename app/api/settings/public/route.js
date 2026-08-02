import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Only fetch non-sensitive keys
    const publicKeys = [
      'bkash_number',
      'nagad_number',
      'rocket_number',
      'contact_phone',
      'contact_whatsapp',
      'contact_email',
      'contact_address',
      'facebook_url',
      'youtube_url',
      'instagram_url',
      'twitter_url',
      'footer_tagline',
      'google_maps_embed'
    ];
    
    const settings = await getSiteSettings(publicKeys);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[PUBLIC_SETTINGS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
