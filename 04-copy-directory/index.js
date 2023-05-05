const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const copyFilePath = path.join(__dirname, 'files');
const pasteFilePath = path.join(__dirname, 'files-copy');

async function copyFile() {
  fs.mkdir(pasteFilePath, { recursive: true }, err => {
    if (err) throw err;
  });

  const files = await readdir(copyFilePath, { withFileTypes: true });
  files.forEach(file => {
    fs.copyFile(path.join(copyFilePath, file.name), path.join(pasteFilePath, file.name), err => {
      if (err) throw err;
    });
  });
  console.log('Копирование завершено успешно.');
}

fs.access(pasteFilePath, fs.F_OK, (err) => {
  if (err) {
    copyFile();
    return;
  }

  fs.rm(pasteFilePath, { recursive: true }, err => {
    if (err) throw err;
    else copyFile();
  });
});



