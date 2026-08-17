async function test() {
  const res = await fetch('https://www.iqcacademy.com/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@iqcacademy.com', password: 'Admin@12345' })
  });
  console.log('Status:', res.status);
  console.log('Headers:', res.headers);
  const data = await res.json();
  console.log('Body:', data);
}
test();
