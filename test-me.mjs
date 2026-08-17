async function test() {
  const loginRes = await fetch('https://www.iqcacademy.com/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@iqcacademy.com', password: 'Admin@12345' })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  const accessTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
  const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
  const cookieHeader = `accessToken=${accessTokenMatch[1]}; refreshToken=${refreshTokenMatch[1]}`;
  
  console.log('Fetching /api/users/me...');
  const meRes = await fetch('https://www.iqcacademy.com/api/users/me', {
    method: 'GET',
    headers: { 'Cookie': cookieHeader }
  });
  
  console.log('Me Status:', meRes.status);
  const meData = await meRes.json();
  console.log('Me Role:', meData.profile?.role);
}
test();
