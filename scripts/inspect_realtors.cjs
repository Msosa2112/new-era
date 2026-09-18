const fs = require('fs');
const path = require('path');

const realtorsDir = 'C:\\TRABAJO\\new era\\REALTORS';
const subdirs = fs.readdirSync(realtorsDir);

console.log('Total subdirectories:', subdirs.length);

const inventory = [];

subdirs.forEach((dirName) => {
  const fullPath = path.join(realtorsDir, dirName);
  if (fs.statSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    console.log(`\nDirectory: "${dirName}"`);
    files.forEach(f => {
      const stats = fs.statSync(path.join(fullPath, f));
      console.log(`  - ${f} (${stats.size} bytes)`);
    });
    inventory.push({
      dirName,
      files
    });
  }
});
