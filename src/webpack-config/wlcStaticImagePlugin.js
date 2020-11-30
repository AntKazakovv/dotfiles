const fs = require('fs');
const _difference = require('lodash/difference');

module.exports = class WlcStaticImagePlugin {
    options = {
        indent: 4,
        sourceDir: 'roots/static/images',
        outputFile: 'staticList',
    };
    list = [];

    constructor(options = {}) {
        Object.assign(this.options, options);
    }

    apply(compiler) {
        compiler.hooks.beforeCompile.tapAsync('WlcStructureInfoPlugin', (compilation, callback) => {
            const updList = this.getStaticList(this.options.sourceDir);
            const outputFilePath = this.options.outputFile + '.json';

            if(!_difference(updList, this.list).length) {
                return callback();
            }
            this.list = updList;

            fs.writeFile(outputFilePath, JSON.stringify(this.list, null, 4), () => {
                console.log(`${outputFilePath} created: ${this.list.length} item(s)`);
                callback();
            });
        });
    }

    getStaticList(entreePath) {
        const buildBranch = (path) => {
            try {
                const files = fs.readdirSync(path);

                files.forEach((file) => {
                    const filePath = path + '/' + file;

                    if (fs.statSync(filePath).isDirectory() && file[0] !== '.') {
                        buildBranch(filePath);
                    } else if (/\.(svg|png|gif|jpg|webp)$/i.test(file)) {
                        res.push(filePath.replace(entreePath, ''));
                    }
                });
            } catch(e) {
                console.error(e);
            }
        };

        const res = [];
        buildBranch(entreePath);
        return res;
    };
};
