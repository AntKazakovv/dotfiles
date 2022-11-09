const {task, src, dest} = require('gulp'),
    data = require('gulp-data'),
    rename = require('gulp-rename'),
    nunjucksRender = require('gulp-nunjucks-render'),
    fs = require('fs');

module.exports = function preBuildTask() {

    /**
     * Create Dist directory
     */
    const makeDistDirectory = () => {
        if (!fs.existsSync(this.params.paths.dist)) {
            fs.mkdirSync(this.params.paths.dist);
        }
    };

    /**
     * Create Temp directory
     */
    const makeTempDirectory = () => {
        if (!fs.existsSync(this.params.paths.temp)) {
            fs.mkdirSync(this.params.paths.temp);
        }
    };

    /**
     * Create symlink to the index.html file in the dist directory
     */
    const makeIndexHtmlSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.indexFile);
        } catch {
            if (!fs.existsSync(this.params.paths.indexFile)) {
                fs.symlinkSync('../static/dist/index.html', this.params.paths.indexFile);
            }
        }
    };

    /**
     * Create symlink to the index.html file in the src directory
     */
    const makeSrcIndexHtmlSymlink = () => {
        if (fs.existsSync(this.params.paths.srcIndexFile)) {
            return;
        }
        try {
            fs.lstatSync(this.params.paths.srcIndexFile);
        } catch {
            const fileName = this.params.isMobileAppBundle ? 'mobile-app-index' : 'index';
            fs.symlinkSync(`../wlc-engine/${fileName}.html`, this.params.paths.srcIndexFile);
        }
    };

    /**
     * Create index.html for mobile app
     * @returns {*}
     */
    const makeMobileAppIndexHtml = () => {
        return src(`${this.params.paths.engine}/src/mobile-app-index.html`)
            .pipe(data(() => {
                return require(`${this.params.paths.root}/template.config.json`)
            }))
            .pipe(nunjucksRender({
                path: `${this.params.paths.src}/templates/`,
            }))
            .pipe(rename('index.html'))
            .pipe(dest(this.params.paths.src));
    };

    /**
     * Create symlink to the wlc-engine directory
     */
    const makeWlcEngineSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.engineLink);
            fs.unlinkSync(this.params.paths.engineLink);
        } catch {
            //
        }
        fs.symlinkSync('./node_modules/@egamings/wlc-engine/src', this.params.paths.engineLink);
    };

    /**
     * Create symlink to the polyfills.ts file in the src directory
     */
    const makePolyfillsSymlink = () => {
        try {
            fs.lstatSync(this.params.paths.polyfillsFile);
            fs.unlinkSync(this.params.paths.polyfillsFile);
        } catch {
            //
        }
        fs.symlinkSync('../wlc-engine/polyfills.ts', this.params.paths.polyfillsFile);
    };

    /**
     * Create symlink to the api tests directory
     */
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

    /**
     * Create site preloader scss
     */
    const createSitePreloader = () => {
        fs.access(`${this.params.paths.src}/app-styles/app.loader.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/app.loader.scss`,
                    '@import \'wlc-engine/engine-scss/_engine.loader.scss\';\n');
            }
        });
    };

    /**
     * Create preloader scss for mobile application
     */
    const createMobileAppPreloader = () => {
        fs.access(`${this.params.paths.src}/app-styles/mobile-app.loader.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/mobile-app.loader.scss`,
                    '@import \'wlc-engine/engine-scss/_mobile-app.loader.scss\';\n');
            }
        });
    };

    /**
     * Create forbidden page scss for mobile application
     */
    const createMobileAppForbidden = () => {
        fs.access(`${this.params.paths.src}/app-styles/mobile-app.forbidden.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/mobile-app.forbidden.scss`,
                    '@import \'wlc-engine/engine-scss/_mobile-app.forbidden.scss\';\n');
            }
        });
    };

    /**
     * Create offline page scss for mobile application
     */
    const createMobileAppOffline = () => {
        fs.access(`${this.params.paths.src}/app-styles/mobile-app.offline.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/mobile-app.offline.scss`,
                    '@import \'wlc-engine/engine-scss/_mobile-app.offline.scss\';\n');
            }
        });
    };

    /**
     * Create hosted fields scss
     */
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

    /**
     * Create Piq fields scss
     */
    const createPiqFields = () => {
        fs.access(`${this.params.paths.src}/app-styles/piq.cashier.scss`, (err) => {
            if (err) {
                fs.writeFileSync(`${this.params.paths.src}/app-styles/piq.cashier.scss`,
                    '//For create alternate color theme styles for hosted fields:\n'+
                    '// 1. Copy this file and set name piq.cashier.alt.scss\n' +
                    '// 2. Generate new css vars using mixin makeCssColorVars ' +
                    'and maps $mainColorsAlt and $fieldColorsAlt\n\n' +
                    '// 3. Add file name with css extension to config $base.colorThemeSwitching.altHostedFieldsStyles \n' +
                    '@import \'wlc-engine/engine-scss/_piq.cashier.scss\';\n\n');
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

    const addMockServiceWorker = () => {
        if (['qa', 'test', 'scr'].includes(process.env.ENV)) {
            const data = fs.readFileSync(
                `${this.params.paths.engine}/src/system/environments/environment.prod.ts`,
            );

            if (!data.includes('worker')) {
                fs.writeFileSync(
                    `${this.params.paths.engine}/src/system/environments/environment.prod.ts`,
                    'import \'./environment.mocks\';\n\n' + data,
                );
            }
        }
    };

    const makeEngineVersion = () => {
        const rawPackageJsonData = fs.readFileSync(
            `${this.params.paths.engine}/package.json`,
        );
        const packageJson = JSON.parse(rawPackageJsonData);

        const engineInfoFileName = '/engine.json';
        const engineInfoFile = `${this.params.paths.static}${engineInfoFileName}`;

        if (fs.existsSync(engineInfoFile)) {
            fs.unlinkSync(engineInfoFile);
        }
        fs.writeFileSync(
            engineInfoFile,
            `{"version": "${packageJson.version}"}`,
        );

        this.addToGitIgnore(
            this.params.paths.static.replace(this.params.paths.root, ''),
            '',
            engineInfoFileName,
        );
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
        createPiqFields();
        addMockServiceWorker();
        makeEngineVersion();

        cb();
    });

    task('enginePrepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();

        cb();
    });

    /** :::::::::::::::::: CORDOVA :::::::::::::::::: */

    task('prepare:cordova:build', async (cb) => {
        makeDistDirectory();
        makeTempDirectory();
        makeWlcEngineSymlink();
        makePolyfillsSymlink();
        makeCustomModule();

        createMobileAppPreloader();
        createMobileAppForbidden();
        createMobileAppOffline();
        createHostedFields();

        await makeMobileAppIndexHtml();
        cb();
    });
};
