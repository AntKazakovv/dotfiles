const fs = require('fs');
const path = require('path');
const _isEqual = require('lodash/isEqual');
const _cloneDeep = require('lodash/cloneDeep');

module.exports = class WlcStructureInfoPlugin {
    dirTree = {};

    opts = {
        emoji: true,
        sourcePath: './src/custom',
        outputFile: 'CustomStructure.md',
    }

    constructor(opts = {}) {
        Object.assign(this.opts, opts);
    }

    apply(compiler) {
        compiler.hooks.done.tap('WlcStructureInfoPlugin', () => {
            const mdTree = this.getMdTree(path.resolve(this.opts.sourcePath));

            if (!mdTree) {
                return;
            }

            const mainOutData = `# Custom structure of project \n ${mdTree}`;

            fs.writeFile(this.opts.outputFile, mainOutData, (err) => {
                if(err) {
                    console.log(err);
                }
                console.log(`${this.opts.outputFile} created`);
            });
        });
    }

    getMdTree(dirPath) {
        const dir = dirPath.split('/').pop();
        let indentation = 0;
        let output = '<details><summary><code>' + this.directoryName(dir) + '</code></summary>';
        let closeTags = '</details>';

        const parseTree = (result) => {
            indentation++;
            Object.keys(result).forEach(key => {
                const data = result[key];
                if (typeof data === 'string' && key[0] !== '.') {
                    const path = data.replace(/^\//, '').split('/');
                    output += '<code>'
                        + this.addIndentation(indentation)
                        + '__'
                        + this.fileName(path.pop())
                        + '</code>';
                } else if (typeof data === 'object') {
                    output += '<details><summary><code>'
                        + this.addIndentation(indentation)
                        + this.directoryName(key)
                        + '</code></summary>';
                    closeTags += '</details>';
                    parseTree(data);
                    indentation--;
                }
            });
        };
        const updDirTree = this.getDirTree(dirPath);

        if(_isEqual(this.dirTree, updDirTree)) {
            return null;
        }

        this.dirTree = _cloneDeep(updDirTree);

        this.removeEmptyDir(updDirTree);

        parseTree(updDirTree);
        output += closeTags;

        return output;
    };

    getDirTree(path) {
        const buildBranch = (path, branch) => {
            try {
                const files = fs.readdirSync(path);

                files.forEach(file => {
                    const filePath = path + '/' + file;
                    const stats = fs.statSync(filePath);

                    if (stats.isDirectory() && file[0] !== '.' && file !== 'node_modules') {
                        branch[file] = {};
                        buildBranch(filePath, branch[file]);
                    } else {
                        if(file[0] !== '~') {
                            branch[file] = filePath.replace(process.cwd(), '');
                        }

                        return branch;
                    }
                });
            } catch(e) {
                console.error(e);
                return branch;
            }

            return branch;
        };

        return buildBranch(path, {});
    };

    removeEmptyDir(tree) {
        Object.keys(tree).forEach((key) => {
            const value = tree[key];
            const type = typeof value;
            if (type === 'object') {
                this.removeEmptyDir(value);
                if (!Object.keys(value).length) {
                    delete tree[key];
                }
            }
        });
    }

    directoryName(name) {
        return `- ${(this.opts.emoji ? '📂 ' : '') + name}`;
    };

    fileName(name) {
        return `- ${(this.emoji ? '📄 ' : '') + name}\n`;
    };

    addIndentation(i) {
        return '_'.repeat(i * 2 + 1);
    };
};
