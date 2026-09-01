import { SignJWT, jwtVerify } from 'jose';

const getAccessSecret = () => new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const getRefreshSecret = () => new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export const signAccessToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // 24 hours — reduces middleware refresh DB hits
    .sign(getAccessSecret());
};

export const signRefreshToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .sign(getRefreshSecret());
};

export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return payload;
  } catch (error) {
    return null;
  }
};
