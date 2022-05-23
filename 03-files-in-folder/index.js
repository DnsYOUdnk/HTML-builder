const path = require('path');
const { stdout } = require('process');
const { readdir, stat } = require('fs/promises');

const pathFolder = path.join(__dirname, 'secret-folder');

const getFiles = async (pathFolder) => {
    try {
        const files = await readdir(pathFolder, {withFileTypes: true});
            for (const fileDirent of files) {
                const nameStat = await stat(path.join(pathFolder, fileDirent.name));
                if( nameStat.isFile() ) {
                    const fileName = path.parse(fileDirent.name).name;
                    const fileExt = path.extname(fileDirent.name).slice(1);
                    const fileSize = nameStat.size/1000 + 'kb';
                    stdout.write(`${fileName} - ${fileExt} - ${fileSize}\n`);
                }
            }
    } catch (err) {
        console.error(err);
    }
}

getFiles(pathFolder)