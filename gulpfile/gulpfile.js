'use strict';

const
    fs = require('fs'),
    _ = require('lodash'),
    concurrently = require('concurrently'),
    stream = require('stream'),
    glob = require('glob'),
    path = require('path'),
    config = require('./config');

class gulpTask {

    constructor(rootDir, bundleType = 'project') {
        this.params = config(rootDir, bundleType);
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

}

module.exports = gulpTask;
