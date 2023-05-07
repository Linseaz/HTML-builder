const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundleDirPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(bundleDirPath, 'bundle.css');
const stylesArr = [];

fs.readdir(stylesPath, (err, files) => {
  if (err) console.error(err);

  for (const file of files) {
    if (path.extname(file) === '.css') {
      const styleFilePath = path.join(stylesPath, file);

      fs.readFile(styleFilePath, 'utf8', (err, data) => {
        if (err) throw err;

        stylesArr.push(data);

        if (stylesArr.length === files.filter(item => path.extname(item) === '.css').length) {
          fs.writeFile(bundleFilePath, stylesArr.join('\n'), (err) => {
            if (err) throw err;
            console.log('bundle.css was successfully created.');
          });
        }
      });
    }
  }
});
