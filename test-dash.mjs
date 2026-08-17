async function test() {
  const loginRes = await fetch('https://www.iqcacademy.com/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@iqcacademy.com', password: 'Admin@12345' })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  console.log('Raw set-cookie:', setCookieHeader);
  
  // Quick manual parse for demo purposes
  const accessTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
  const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
  
  const cookieHeader = `accessToken=${accessTokenMatch[1]}; refreshToken=${refreshTokenMatch[1]}`;
  
  console.log('Sending Cookie Header:', cookieHeader);
  
  const dashRes = await fetch('https://www.iqcacademy.com/admin/dashboard', {
    method: 'GET',
    headers: { 'Cookie': cookieHeader },
    redirect: 'manual'
  });
  
  console.log('Dash Status:', dashRes.status);
  console.log('Dash Headers location:', dashRes.headers.get('location'));
}
test();
