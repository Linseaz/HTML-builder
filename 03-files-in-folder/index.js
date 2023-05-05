const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

async function readDirectory() {
  const files = await readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    let fileInfo = '';

    if (file.isFile()) {

      const lastDotIndex = file.name.lastIndexOf('.');
      fileInfo += `${file.name.substring(0, lastDotIndex)}`;
      fileInfo += ` ${path.extname(file.name).slice(1)}`;

      fs.stat(path.join(dirPath, file.name), function (error, stat) {
        if (error) console.error(error);

        fileInfo += ` ${(stat.size / 1024).toFixed(3)}`;

        console.log(`<${fileInfo.split(' ').join('> - <')} kb>`);
      });
    }
  }
}

readDirectory();