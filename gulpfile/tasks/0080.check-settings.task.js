const {task} = require('gulp');
const fs = require('fs');

module.exports = function checkSettings() {
    task('check-settings', (cb) => {
        checkManifest(cb);
        checkAngularJson(cb);
        checkMainTS(cb);
        checkPackageJSON(cb)
    });
};

const checkManifest = (cb) => {
    try {
        const pathScreenshot1 = fs.realpathSync(`${process.env.INIT_CWD}/roots/favicon/screenshot-narrow.png`);
        const pathScreenshot2 = fs.realpathSync(`${process.env.INIT_CWD}/roots/favicon/screenshot-wide.png`);
        fs.existsSync(pathScreenshot1);
        fs.existsSync(pathScreenshot2);

        const configPath = fs.realpathSync(`${process.env.INIT_CWD}/roots/favicon/site.webmanifest`);
        const file = fs.readFileSync(configPath).toString();
        const json = JSON.parse(file);

        if (!json['screenshots']) {
            throw Error();
        }

    } catch {
        console.warn(`
            Please add screenshots of the application and add them to the config in the manifest file.
            Wiki information about this - https://wiki.egamings.com/pages/viewpage.action?pageId=147391120
        `);
    }
    cb();
};

const checkAngularJson = (cb) => {
    try {
        const angularJsonPath = fs.realpathSync(`${process.env.INIT_CWD}/angular.json`);
        const angularJsonFile = fs.readFileSync(angularJsonPath).toString();
        const angularJson = JSON.parse(angularJsonFile);

        if (!angularJson.cli?.cache?.path) {
            throw Error();
        }

    } catch {
        console.warn(`
            Please add angular caching settings for the project to the angular.json file.
            Example
                "cache": {
                    "enabled": true,
                    "environment": "all",
                    "path": "/tmp/cache/angular/wlc_projectname"
                }
        `);
    }
    cb();
};

const checkMainTS = (cb) => {
    const mainTS = fs.realpathSync(`${process.env.INIT_CWD}/src/main.ts`);
    const mainTSFile = fs.readFileSync(mainTS).toString();

    if (mainTSFile.includes('DOMContentLoaded')) {
        console.warn(
            '\x1b[31m%s\x1b[0m', '\n  WARN: Please remove the subscription '
            +
            'document.addEventListener("DOMContentLoaded") from src/main.ts'
        );
    }

    cb();
};

const checkPackageJSON = (cb) => {
    const package = fs.realpathSync(`${process.env.INIT_CWD}/package.json`);
    const packageJSONString = fs.readFileSync(package).toString();
    const packageJSON = JSON.parse(packageJSONString);

    if (packageJSON['scripts']
        && packageJSON['scripts']['fullup']
        && (!packageJSON['scripts']['fullup'].includes('gulp update:configs')
            || !packageJSON['scripts']['update:engine'].includes('gulp update:configs'))
    ) {
        console.warn('\x1b[31m%s\x1b[0m', '\n  WARN: Please run gulp update:configs');
    }

    cb();
};
