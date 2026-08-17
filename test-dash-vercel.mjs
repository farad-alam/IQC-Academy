async function test() {
  const loginRes = await fetch('https://iqc-academy.vercel.app/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@iqcacademy.com', password: 'Admin@12345' })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  const accessTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
  const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
  const cookieHeader = `accessToken=${accessTokenMatch[1]}; refreshToken=${refreshTokenMatch[1]}`;
  
  const dashRes = await fetch('https://iqc-academy.vercel.app/admin/dashboard', {
    method: 'GET',
    headers: { 'Cookie': cookieHeader },
    redirect: 'manual'
  });
  
  console.log('Dash Status:', dashRes.status);
  console.log('Dash Headers location:', dashRes.headers.get('location'));
}
test();
