const glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    execSync = require('child_process').execSync;

module.exports = class AotCompilation {

    static customTemplates() {
        const projectDir = process.cwd();
        const filesRegExp = `${projectDir}/src/custom/**/[^~]*.html`;

        glob.sync(filesRegExp).forEach(file => {
            const engineFile = file.replace('/src/custom/', '/wlc-engine/');

            if (fs.existsSync(engineFile)) {
                fs.copyFileSync(file, engineFile);
            }
        });
    }

    static customStyles() {
        const projectDir = process.cwd();
        const filesRegExp = `${projectDir}/src/custom/**/[^~]*.scss`;

        glob.sync(filesRegExp).forEach(file => {
            const engineFile = file.replace('/src/custom/', '/wlc-engine/');

            if (fs.existsSync(engineFile)) {
                const fileName = path.basename(engineFile);
                const customThemesFileName = `~custom-themes.scss`;
                const customStylesFileName = `~custom-styles.scss`;
                const newCustomStylesFile = engineFile.replace(fileName, customStylesFileName);
                const newCustomThemesFile = engineFile.replace(fileName, customThemesFileName);

                let customContent = fs.readFileSync(file).toString();
                const importPath = file
                    .replace(projectDir, '')
                    .replace('/src/custom/', 'wlc-engine/');

                let useCustomThemes = false;
                const defaultStylesImportIndex = customContent.indexOf(`@import '${importPath}';`);

                if (defaultStylesImportIndex) {
                    const customThemesContent = customContent.substr(0, defaultStylesImportIndex);
                    useCustomThemes = true;
                    fs.writeFileSync(newCustomThemesFile, customThemesContent);
                }

                customContent = customContent.replace(`@import '${importPath}';`, '');
                fs.writeFileSync(newCustomStylesFile, customContent);

                let engineFileContent = fs.readFileSync(engineFile).toString();

                const importStylesPath = importPath.replace(fileName, customStylesFileName);
                const importStylesRule = `@import '${importStylesPath}';`;

                if (engineFileContent.indexOf(importStylesRule) === -1) {
                    engineFileContent += `\n${importStylesRule}`;
                    fs.writeFileSync(engineFile, engineFileContent);
                }

                const importThemesPath = importPath.replace(fileName, customThemesFileName);
                const importThemesRule = `@import '${importThemesPath}';`;

                if (useCustomThemes && engineFileContent.indexOf(importThemesRule) === -1) {
                    const importIndex = engineFileContent.indexOf('@import');
                    engineFileContent =
                        engineFileContent.substring(0, importIndex)
                        + `${importThemesRule}\n\n`
                        + engineFileContent.substring(importIndex);
                    fs.writeFileSync(engineFile, engineFileContent);
                }
            }
        });
    }

    static disableAngularCompilerOptions() {
        const projectDir = process.cwd();
        const engineDir = fs.realpathSync(`${projectDir}/wlc-engine`);
        const tsConfigFilePath = fs.realpathSync(`${engineDir}/../tsconfig.json`);

        execSync(`sed -i 's/angularCompilerOptions/angularCompilerOptionsDisabled/g' ${tsConfigFilePath}`);
    }
}
