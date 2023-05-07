const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const copyFilePath = path.join(__dirname, 'files');
const pasteFilePath = path.join(__dirname, 'files-copy');

async function copyDir(src, dist) {
  fs.mkdir(dist, { recursive: true }, err => {
    if (err) throw err;
  });

  const files = await fsPromises.readdir(src, { withFileTypes: true });
  files.forEach(file => {
    const srcFile = path.join(src, file.name);
    const distFile = path.join(dist, file.name);

    if (file.isDirectory()) {
      copyDir(srcFile, distFile);
    } else {
      fs.copyFile(srcFile, distFile, err => {
        if (err) throw err;
      });
    }
  });
}

fs.access(pasteFilePath, fs.F_OK, (err) => {
  if (err) {
    copyDir(copyFilePath, pasteFilePath);
    console.log('Copying completed successfully.');
    return;
  }

  fs.rm(pasteFilePath, { recursive: true }, err => {
    if (err) throw err;
    else {
      copyDir(copyFilePath, pasteFilePath);
      console.log('Copying completed successfully.');
    }
  });
});



