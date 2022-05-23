const path = require('path');
const fs = require('fs');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

const pathCopyFolder = path.join(__dirname, 'files-copy');
const pathFolder = path.join(__dirname, 'files');

const getCopyFiles = async (directory, copyDirectory) => {
    try {
        const files = await readdir(directory, {withFileTypes: true});
            for (const fileDirent of files) {
                if(fileDirent.isFile()) {
                    await copyFile(path.join(directory, fileDirent.name), path.join(copyDirectory, fileDirent.name));
                } else {
                    const insideFolder = path.join(directory, fileDirent.name);
                    const insideCopyFolder = path.join(copyDirectory, fileDirent.name);

                    await mkdir(insideCopyFolder);
                    await getCopyFiles(insideFolder, insideCopyFolder)
                }
            }
    } catch (err) {
        console.error(err);
    }
}

(async function () {
    await rm(pathCopyFolder, { recursive: true, force: true });
    await mkdir(pathCopyFolder);
    getCopyFiles(pathFolder, pathCopyFolder);
})();