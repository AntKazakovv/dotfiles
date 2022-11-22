'use strict';

const
    fs = require('fs'),
    _ = require('lodash'),
    execSync = require('child_process').execSync,
    concurrently = require('concurrently'),
    stream = require('stream'),
    glob = require('glob'),
    path = require('path'),
    config = require('./config');

class gulpTask {

    constructor(rootDir, bundleType = 'project', pathsConfig) {
        this.params = config(rootDir, bundleType, pathsConfig);
        this.mobileAppApiUrl = this.getMobileAppApiUrl();
        process.setMaxListeners(0);
        this.registerTasks();
    }

    registerTasks() {
        glob
            .sync(`${__dirname}/tasks/*.js`)
            .map((file) => require(path.resolve(file)))
            .forEach((task) => {
                task.apply(this);
            });
    }

    deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file /*, index */) => {
                const curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }


    execShell(messages, hideOutput = false, params = {}) {
        if (_.isString(messages)) {
            messages = [messages];
        }

        const options = _.merge({
            maxProcesses: 30
        }, params);

        if (hideOutput) {
            const writable = new stream.Writable({
                write: function(chunk, encoding, next) {
                    next();
                }
            });
            options.outputStream = writable;
        }
        return concurrently([...messages], options);
    }

    execShellSync(messages, hideOutput = false) {
        if (_.isString(messages)) {
            messages = [messages];
        }
        return Promise.all(messages.map((command) => {
            this.execShell(command, hideOutput);
        }));
    }

    execNativeShellSync(command) {
        var response = execSync(command);
        return response.toString('UTF8');
    }

    addToGitIgnore(block, type, filePath) {
        const file = path.normalize(`${block}/${type}/${filePath}`);
        let ignore = fs.readFileSync(this.params.paths.root + '/.gitignore').toString();

        if (ignore.indexOf(file) !== -1) {
            return;
        }

        ignore = ignore.split('\n');
        const ignoreBlock = `# ${block}`;
        let isBlock = false;
        const newIgnore = [];
        for (const str of ignore) {

            if (!isBlock && str === ignoreBlock) {
                isBlock = true;
            }

            if (isBlock) {
                if (str === file) {
                    newIgnore.push(str);
                    isBlock = false;
                } else if (str.length === 0) {
                    newIgnore.push(file, str);
                    isBlock = false;
                } else {
                    newIgnore.push(str);
                }
            } else {
                newIgnore.push(str);
            }
        }
        fs.writeFileSync(this.params.paths.root + '/.gitignore', newIgnore.join('\n'));
    };

    parseProcessParams(params) {
        if (params && params.length > 2) {
            params = params.slice(2);
            return params.reduce((acc, item) => {
                const parsed = item.match(/(?<=--).+?(?=\=)|(?<=\=).+?$/gi);
                if (parsed && parsed.length === 2) {
                    acc[parsed[0]] = parsed[1];
                }
                return acc;
            }, {});
        } else {
            return {};
        }
    }

    /**
     * Get apiUrl for mobile application
     */
    getMobileAppApiUrl() {
        let configuration = this.getConfiguration();
        if (!configuration) return;

        const code = `const window: any = {}; import {environment} from "${this.params.paths.src}/environments/environment.${configuration}"; console.log(environment.mobileApp.apiUrl)`;

        const result = this.execNativeShellSync("npx ts-node -e '" + code + "' --skip-project --transpile-only").trim();

        if (result.indexOf('http') === 0) {
            return result;
        }
    }

    /**
     * Get configuration param value of build
     *
     * @returns {*}
     */
    getConfiguration() {
        return this.parseProcessParams(process.argv)['configuration'];
    }
}

module.exports = gulpTask;
