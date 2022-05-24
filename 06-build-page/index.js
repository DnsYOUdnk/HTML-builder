const path = require('path');
const fs = require('fs');
const { readdir, readFile, copyFile, writeFile, rm, mkdir, stat } = require('fs/promises');
const colors = require('colors');

const pathTemplHtml = path.join(__dirname, 'template.html');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname,'assets');

const pathBuild = path.join(__dirname, 'project-dist');
const pathBuildAssets = path.join(pathBuild, 'assets');

const getBuildHtml = async (valueHtml, components, buildDirectory) => {
    try {
        let dataHtml = await readFile(valueHtml, 'utf-8');
        const arrElemHtml = await Promise.all(
            dataHtml.match(/{{\w*}}/gi)
                    .map((elem) => {
                        elem = elem.slice(2, -2) + '.html';
                        let elemValue = readFile(path.join(components, elem),'utf-8');
                        return elemValue ;
        }))
        arrElemHtml.forEach(element => {
            dataHtml = dataHtml.replace(/{{\w*}}/i, element)
        })
        await writeFile(path.join(buildDirectory, 'index.html'), dataHtml, 'utf-8' )
        process.stdout.write('A new html file has been created in the build directory "project-dist"\n')
    } catch (err) {
        console.error(err);
    }
}

const arrStyles = [];
const getDataStyle = async (directory) => {
    const stream = fs.createReadStream(directory, 'utf-8');
    for await (const chunk of stream) {
        arrStyles.push(chunk);
    }
}

const getBuildStyle = async (directory, buildDirectory) => {
    try {
        const files = await readdir(directory, {withFileTypes: true});
            for (const fileDirent of files) {
                const extFile = path.extname(fileDirent.name).slice(1);
                if(fileDirent.isFile() && extFile === 'css') {
                    await getDataStyle(path.join(directory, fileDirent.name));
                };
            }
        fs.writeFile(path.join(buildDirectory, 'style.css'), arrStyles.join('\n'), err => {
            if(err) throw err;
            process.stdout.write('A new css file has been created in the build directory "project-dist"\n')
        })
    } catch (err) {
        console.error(err);
    }
}

const getCopyFiles = async (directory, copyDirectory) => {
    try {
        const files = await readdir(directory, {withFileTypes: true});
            for (const fileDirent of files) {
                if(fileDirent.isFile()) {
                    await copyFile(path.join(directory, fileDirent.name), path.join(copyDirectory, fileDirent.name));
                    process.stdout.write(`${fileDirent.name} file is copied to the build directory\n`);
                } else {
                    const insideFolder = path.join(directory, fileDirent.name);
                    const insideCopyFolder = path.join(copyDirectory, fileDirent.name);

                    await mkdir(insideCopyFolder);
                    await getCopyFiles(insideFolder, insideCopyFolder)
                    process.stdout.write(`The ${fileDirent.name} folder is copied to the assets build directory "project-dist"\n`);
                }
            }
    } catch (err) {
        console.error(err);
    }
}

(async function () {
    await rm(pathBuild, { recursive: true, force: true });
    await mkdir(pathBuild, {recursive: true});
    await mkdir(pathBuildAssets, {recursive: true});
    await getBuildHtml(pathTemplHtml, pathComponents, pathBuild);
    await getBuildStyle(pathStyles, pathBuild)
    await getCopyFiles(pathAssets, pathBuildAssets);
    process.stdout.write(colors.green(`\n The build directory was successfully created. Good luck! \n\n`));
})();