const path = require('path');
const fs = require('fs');
const {stdin, stdout, exit} = process;

const pathFile = path.join(__dirname, 'writeText.txt')

fs.access(pathFile, fs.F_OK, (err) => {
    if (err) fs.createWriteStream(pathFile)
    return
  })

stdout.write('Пожалуйста, введите текст (для выхода введите exit)\n');
stdin.on('data', data => {
        if(data.toString().trim() === 'exit') exit();
        fs.appendFile(pathFile, data, err => {
            if (err) return console.error(err.message);
        })
    })

process.on('exit', () => stdout.write('Выход успешно совершен. Удачи!'));
process.on('SIGINT', () => exit());