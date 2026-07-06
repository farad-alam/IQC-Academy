import { cookies } from 'next/headers';
import { verifyAccessToken } from '../auth';
import prisma from '../db';

/**
 * Extracts the user from the current request based on the JWT token in cookies.
 * 
 * @returns {Promise<Object|null>} The user object or null if not authenticated
 */
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      }
    });

    if (!user || user.status !== 'ACTIVE') return null;

    return user;
  } catch (error) {
    console.error('Error fetching auth user:', error);
    return null;
  }
}
