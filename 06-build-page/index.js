const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const resultPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const indexPath = path.join(resultPath, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(resultPath, 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsResultPath = path.join(resultPath, 'assets');
const regExp = /{{(.*?)}}/g;
const stylesArr = [];

async function createDirectory(path) {
  try {
    await fs.promises.stat(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.promises.mkdir(path);
    } else {
      console.log(error);
    }
  }
}

createDirectory(resultPath).then(() => {
  fs.writeFile(indexPath, '', (error) => {
    if (error) throw error;
  });
}).then(() => {
  const read = fs.createReadStream(templatePath);
  const write = fs.createWriteStream(indexPath);
  read.on('data', async (data) => {
    const components = await readHtmlFiles();
    let transform = data.toString();
    let sim;
    while ((sim = regExp.exec(data)) !== null) {
      transform = transform.replace(`{{${sim[1]}}}`, components[sim[1]]);
    }
    write.write(transform);
    console.log('HTML successfully created. 😊');
  });
});

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
            console.log('Style successfully created. 😊');
          });
        }
      });
    }
  }
});

async function readHtmlFiles() {
  const files = await fsPromises.readdir(componentsPath);
  const result = {};
  for (const file of files) {
    const buffer = await fsPromises.readFile(path.join(componentsPath, `${file.split('.')[0]}.html`));
    result[file.split('.')[0]] = buffer.toString();
  }
  return result;
}

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

fs.access(assetsResultPath, fs.F_OK, (err) => {
  if (err) {
    copyDir(assetsPath, assetsResultPath);
    console.log('Copying completed successfully. 😊');
    return;
  }

  fs.rm(assetsResultPath, { recursive: true }, err => {
    if (err) throw err;
    else {
      copyDir(assetsPath, assetsResultPath);
      console.log('Copying completed successfully. 😊');
    }
  });
});
