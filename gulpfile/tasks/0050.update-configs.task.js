const {task, src, dest} = require('gulp'),
    jeditor = require('gulp-json-editor'),
    _ = require('lodash'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs');

const beautifyConfig = {
    'end_with_newline': true,
    'preserve_newlines': true,
    'wrap_line_length': 10,
};

/**
 * @example
 * {
 *  "file": "/angular.json",
 *   "data": {
 *       "version": 111,
 *       "projects.wlc-engine.architect.build.configurations.production.budget[0].maximumError": "10mb",
 *       "projects.wlc-engine.architect.build.configurations.production.budget[1].maximumError": "8mb"
 *   }
 * }
 */

module.exports = function updateConfigs() {
    const root = this.params.paths.root;

    task('update:configs', async () => {
        this.addToGitIgnore('/', '', '.angular');

        try {
            fs.unlinkSync('roots/sw.js');
            fs.symlinkSync('wlc-engine/mockServiceWorker.js', 'roots/sw.js');
        } catch (_) {
            console.warn('Oops, well, we managed to update the worker ');
        }

        const configs = glob.sync(`${__dirname}/../global-configs/*.global.json`);

        for (const config of configs) {
            const {file, data} = require(path.resolve(config));

            if (_.isEmpty(data)) {
                continue;
            }

            src(root + file)
                .pipe(jeditor(json => {
                    for (const key in data) {
                        _.set(json, key, data[key]);
                    }
                    return json;
                }, beautifyConfig))
                .pipe(dest(path.dirname(root + file)));
        }
    });
};
