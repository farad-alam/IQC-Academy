import { getSiteSettings } from '@/lib/siteSettings';
import { NextResponse } from 'next/server';

/**
 * Validates the deletion security key from the request headers.
 * If invalid, returns a NextResponse object with a 403 status.
 * If valid, returns null.
 * 
 * Usage in API Route:
 * const securityError = await validateDeletionKey(req);
 * if (securityError) return securityError;
 */
export async function validateDeletionKey(req) {
  const providedKey = req.headers.get('x-deletion-key');
  
  if (!providedKey) {
    return NextResponse.json({ error: 'ডিলিট সিকিউরিটি কী (Security Key) প্রদান করা হয়নি।' }, { status: 403 });
  }

  const settings = await getSiteSettings(['deletion_security_key']);
  const expectedKey = settings.deletion_security_key;

  if (!expectedKey) {
    return NextResponse.json({ error: 'সিস্টেমে কোনো ডিলিট সিকিউরিটি কী সেট করা নেই। দয়া করে সেটিংস থেকে কী সেট করুন।' }, { status: 403 });
  }

  if (providedKey !== expectedKey) {
    return NextResponse.json({ error: 'ভুল সিকিউরিটি কী (Security Key)।' }, { status: 403 });
  }

  return null; // Valid
}
