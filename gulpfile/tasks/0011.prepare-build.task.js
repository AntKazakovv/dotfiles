const {task} = require('gulp'),
    fs = require('fs');

module.exports = function preBuildTask() {
    // Create Dist directory
    const makeDistDirectory = () => {
        if (!fs.existsSync(this.params.paths.dist)) {
            fs.mkdirSync(this.params.paths.dist);
        }
    };

    // Create Temp directory
    const makeTempDirectory = () => {
        if (!fs.existsSync(this.params.paths.temp)) {
            fs.mkdirSync(this.params.paths.temp);
        }
    };

    // Create symlink to the index.html file in the dist directory
    const makeIndexHtmlSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.indexFile);
        } catch {
            if (!fs.existsSync(this.params.paths.indexFile)) {
                fs.symlinkSync('../static/dist/index.html', this.params.paths.indexFile);
            }
        }
    };

    // Create symlink to the index.html file in the src directory
    const makeSrcIndexHtmlSymlink = () => {
        if (fs.existsSync(this.params.paths.srcIndexFile)) {
            return;
        }
        try {
            fs.lstatSync(this.params.paths.srcIndexFile);
        } catch {
            fs.symlinkSync('../wlc-engine/index.html', this.params.paths.srcIndexFile);
        }
    };

    // Create symlink to the wlc-engine directory
    const makeWlcEngineSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.engineLink);
            fs.unlinkSync(this.params.paths.engineLink);
        } catch {
            //
        }
        fs.symlinkSync('./node_modules/@egamings/wlc-engine/src', this.params.paths.engineLink);
    };

    // Create symlink to the polyfills.ts file in the src directory
    const makePolyfillsSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.polyfillsFile);
            fs.unlinkSync(this.params.paths.polyfillsFile);
        } catch {
            //
        }
        fs.symlinkSync('../wlc-engine/polyfills.ts', this.params.paths.polyfillsFile);
    };

    // Create symlink to the api tests directory
    const makeApiTestSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.apiTest);
            fs.unlinkSync(this.params.paths.apiTest);
        } catch {
            //
        }
        fs.symlinkSync('./node_modules/@egamings/wlc-engine/api-tests', this.params.paths.apiTest);
        this.addToGitIgnore('/', '', 'api-tests');
    };

    // Create site preloader scss
    const createSitePreloader = () => {
        fs.access(`${this.params.paths.src}/app-styles/app.loader.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/app.loader.scss`,
                    '@import \'wlc-engine/engine-scss/_engine.loader.scss\';\n');
            }
        });
    };

    // Create hosted fields scss
    const createHostedFields = () => {
        fs.access(`${this.params.paths.src}/app-styles/hosted.fields.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/hosted.fields.scss`,
                    '//For create alternate color theme styles for hosted fields:\n'+
                    '// 1. Copy this file and set name hosted.fields.alt.scss\n' +
                    '// 2. Generate new css vars using mixin makeCssColorVars ' +
                    'and maps $mainColorsAlt and $fieldColorsAlt\n\n' +
                    '// 3. Add file name with css extension to config $base.colorThemeSwitching.altHostedFieldsStyles \n' +
                    '@import \'wlc-engine/engine-scss/_hosted.fields.scss\';\n\n' +
                    '@include makeCssColorVars($mainColors);\n' +
                    '@include makeCssColorVars($fieldColors);\n');
            }
        });
    };

    const makeCustomModule = () => {

        const modulePath = 'custom/custom.module.ts';
        const statesConfigPath = 'custom/system/config/custom.states.ts';

        fs.access(`${this.params.paths.src}/${modulePath}`, (err) => {
            if (err) {

                const path = modulePath.split('/').slice(0, -1).join('/');
                fs.mkdirSync(`${this.params.paths.src}/${path}/`, {recursive: true});

                fs.copyFileSync(
                    `${this.params.paths.engine}/wlc-src/${modulePath}`,
                    `${this.params.paths.src}/${modulePath}`,
                );
            }
        });

        fs.access(`${this.params.paths.src}/${statesConfigPath}`, (err) => {
            if (err) {

                const path = statesConfigPath.split('/').slice(0, -1).join('/');
                fs.mkdirSync(`${this.params.paths.src}/${path}/`, {recursive: true});

                fs.copyFileSync(
                    `${this.params.paths.engine}/wlc-src/${statesConfigPath}`,
                    `${this.params.paths.src}/${statesConfigPath}`,
                );
            }
        });
    };

    task('prepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();
        makeIndexHtmlSymlink();
        makeWlcEngineSymlink();
        makeSrcIndexHtmlSymlink();
        makePolyfillsSymlink();
        makeCustomModule();
        createSitePreloader();
        createHostedFields();
        makeApiTestSymlink();

        cb();
    });

    task('enginePrepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();

        cb();
    });
};
