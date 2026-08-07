import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

// GET /api/auth/register-status — public, used by register page to check if open
export async function GET() {
  try {
    const settings = await getSiteSettings(['individual_registration_open']);
    // Default to open if setting not set yet
    const open = settings.individual_registration_open !== 'false';
    return NextResponse.json({ open });
  } catch {
    return NextResponse.json({ open: true }); // fail open
  }
}
