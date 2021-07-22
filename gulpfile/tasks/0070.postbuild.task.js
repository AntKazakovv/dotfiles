const {task} = require('gulp'), fs = require('fs');


module.exports = function postBuildTask() {
    task('build:sw-fix', async (cb) => {
        process.on('SIGINT', () => {
            cb && cb();
            process.exit();
        });
        await this.execShell('npm run sw-fix', false, {
            killOthers: ['success', 'failure'],
            raw: true,
        });

        cb();
    });

    task('build:symlinkHeadFile', (cb) => {
        try {
            fs.lstatSync(this.params.paths.indexHeadFile);
            fs.unlinkSync(this.params.paths.indexHeadFile);
        } catch (err) {
            //
        }
        fs.symlinkSync('../../wlc-engine/head.tpl', this.params.paths.indexHeadFile);
        cb();
    });

    task('build:copyHeadFile', (cb) => {
        this.addToGitIgnore('/roots', 'template', 'head.tpl');
        fs.access(this.params.paths.indexHeadFile, (err) => {
            if (err) {
                fs.copyFile(this.params.paths.srcIndexHeadFile, this.params.paths.indexHeadFile, (err) => {
                    if (err) throw err;
                });
            }
        });
        cb();
    });

    task('build:modifyIndexFile', (cb) => {
        const path = `${this.params.paths.dist}/index.html`;
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            if (data.indexOf('{% include "head.tpl" %}') === -1) {
                data = data.replace('</head>', '{% include "head.tpl" %} </head>');
                fs.writeFile(path, data, (err, data) => {
                    if (err) throw err;
                });
            }
        });
        cb();
    });
};
