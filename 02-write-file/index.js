const fs = require('fs');
const path = require('path');

const textFile = path.join(__dirname, 'text.txt');

fs.writeFile(textFile, '', (error) => {
  if (error) throw error;
  console.log('Приветствую, введите текст:');
}
);

process.stdin.on('data', (data) => {
  const text = data.toString().trim();
  if (text === 'exit') {
    console.log('Приложение остановлено.\nДо свидания!');
    process.exit();
  } else {
    fs.appendFile(textFile, `${text}\n`, (error) => {
      if (error) throw error;
    });
  }
});

process.on('SIGINT', () => {
  console.log('Приложение остановлено.\nДо свидания!');
  process.exit();
});
