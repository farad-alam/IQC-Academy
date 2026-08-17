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
  
  console.log('Sending Cookie Header to /admin/dashboard...');
  
  // Follow redirects
  const dashRes = await fetch('https://www.iqcacademy.com/admin/dashboard', {
    method: 'GET',
    headers: { 'Cookie': cookieHeader },
    redirect: 'follow'
  });
  
  console.log('Final URL:', dashRes.url);
  console.log('Final Status:', dashRes.status);
  
  const text = await dashRes.text();
  console.log('Title:', text.match(/<title>(.*?)<\/title>/)?.[1]);
  console.log('Contains "AdminLoginPage":', text.includes('AdminLoginPage') || text.includes('এডমিন প্যানেলে'));
}
test();
