const fs = require('fs');

const replaceInFile = (filePath, searchValue, replaceValue) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchValue)) {
    fs.writeFileSync(filePath, content.replaceAll(searchValue, replaceValue), 'utf8');
    console.log('Updated:', filePath);
  }
};

// 1. TopNav and BottomNav hrefs
replaceInFile('components/layout/TopNav.js', "href: '/home'", "href: '/'");
replaceInFile('components/layout/TopNav.js', "href=\"/home\"", "href=\"/\"");
replaceInFile('components/layout/BottomNav.js', "href: '/home'", "href: '/'");

// 2. Login redirect
replaceInFile('app/login/page.js', "window.location.href = '/home'", "window.location.href = '/'");

// 3. Admin login return link
replaceInFile('app/admin/login/page.js', 'href="/home"', 'href="/"');

// 4. Donate page return link
replaceInFile('app/(user)/donate/page.js', 'href="/home"', 'href="/"');

// 5. Registration success page
replaceInFile('app/register/success/page.js', 'href="/home"', 'href="/"');

// 6. Fix import in app/(user)/page.js (was app/(user)/home/page.js)
replaceInFile('app/(user)/page.js', "import styles from './home.module.css'", "import styles from './home.module.css'"); // this actually stays the same since they are in same dir now! Wait, yes. 

console.log('Replacements completed.');
