const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.next')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else if (dirFile.endsWith('.js')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('.');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // The code contains literal backslash followed by backtick and literal backslash followed by dollar sign
  // Let's replace them
  content = content.replace(/\`/g, '`');
  content = content.replace(/\\$/g, '$');
  
  if (content !== originalContent) {
    console.log('Fixed:', file);
    fs.writeFileSync(file, content, 'utf8');
  }
});
