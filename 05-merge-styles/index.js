const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist');

const arrStyles = [];

const getData = async (directory) => {
    const stream = fs.createReadStream(directory, 'utf-8');
    for await (const chunk of stream) {
        arrStyles.push(chunk);
    }
}

const getBundleStyle = async (directory, copyDirectory) => {
    try {
        const files = await readdir(directory, {withFileTypes: true});
            for (const fileDirent of files) {
                const extFile = path.extname(fileDirent.name).slice(1);
                if(fileDirent.isFile() && extFile === 'css') {
                    await getData(path.join(directory, fileDirent.name));
                };
            }
        fs.writeFile(path.join(copyDirectory, 'bundle.css'), arrStyles.join('\n'), err => {
            if(err) throw err;
            process.stdout.write('Выполнение завершено')
        })
    } catch (err) {
        console.error(err);
    }
}

getBundleStyle(pathStyles, pathBundle)