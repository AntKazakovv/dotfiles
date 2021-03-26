const {task} = require('gulp'),
    fs = require('fs');

module.exports = function preBuildTask() {
    task('prepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();
        makeIndexHtmlSymlink();
        makeWlcEngineSymlink();

        cb();
    });

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
                    (err) => {if (err) throw err;},
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
                    (err) => {if (err) throw err;},
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

        cb();
    });

    task('enginePrepare:build', (cb) => {
        makeDistDirectory();
        makeTempDirectory();

        cb();
    });
};
