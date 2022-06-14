const {task, src, dest} = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv,
    _ = require('lodash'),
    inquirer = require('inquirer'),
    sort = require('gulp-sort'),
    modifyFile = require('gulp-modify-file'),
    markdown = require('gulp-markdown'),
    concat = require('gulp-concat'),
    customFilter = require('gulp-custom-filter'),
    glob = require('glob'),
    luxon = require('luxon');

module.exports = function changeLogsTask() {

    const generateSummary = () => {
        const children = glob
            .sync(`${this.params.paths.changeLogs}/*.md`)
            .map((file) => {
                const fileNameInfo = path.basename(file, '.md').split('_');
                return {
                    title: `${fileNameInfo[0].replace(/-rc.(\d*)$/, 'RC$1')} (${fileNameInfo[1]})`,
                    file: `./900.change-logs/releases/${path.basename(file)}`,
                };
            });

        let summary;
        try {
            summary = JSON.parse(
                fs.readFileSync(this.params.paths.docsSummary).toString(),
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('\n\x1b[31mCompodoc summary read or parse error\x1b[0m\n');
            return false;
        }
        const changeLogs = _.find(summary, (i) => i._id === 'changelogs');
        changeLogs.children = _.sortBy(children, 'title').reverse();
        fs.writeFileSync(this.params.paths.docsSummary, JSON.stringify(summary, null, 4));
    };

    const deleteRClogs = () => {
        glob
            .sync(`${this.params.paths.changeLogs}/*.md`)
            .forEach((file) => {
                if (file.includes('-rc.')) {
                    fs.unlinkSync(file);
                }
            });
    };

    task('change-logs', async (done) => {
        const tag = argv.tag;
        if (!tag) {
            throw Error('Parameter tag (id of release tag) is empty');
        }

        const isRC = argv.tag.includes('-rc');

        const isLastItem = (message) => {
            if (isRC) {
                return message.includes('Updated for release');
            } else {
                return message.includes('Updated for release') && !message.includes('-rc.');
            }
        };

        //get repository url
        const origin = this.execNativeShellSync('git remote get-url origin').trim();
        const originMath = origin.match(/\@(.*)\:/);
        const gitUrl = _.isArray(originMath) ? originMath[1] : 'wlcgitlab.egamings.com';


        let apiKey = '';
        if (fs.existsSync('.gitlab-key')) {
            apiKey = _.trim(fs.readFileSync('.gitlab-key'));
        } else {
            throw Error(
                `Gitlab api key not found. See https://${gitUrl}/wlc/devtools/-/blob/master/theme/change-logs.md`,
            );
        }

        const searchUrl = `curl "https://wlcgitlab.egamings.com/api/v4/projects/?private_token=${apiKey}`
            + '&search='
            + encodeURIComponent('wlc-engine')
            + '"';

        const response = this.execNativeShellSync(searchUrl);
        let result;

        try {
            result = JSON.parse(response);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`\n\x1b[31mGitLab API response error: ${error}\x1b[0m\n`);
            return false;
        }

        if (result.message) {
            // eslint-disable-next-line no-console
            console.log(`\n\x1b[31mGitLab API error: ${result.message}\x1b[0m\n`);
            return false;
        }

        const projectId = _.find(result, (item) => item.ssh_url_to_repo === origin).id;

        const commitHistory = this.execNativeShellSync('git log --oneline -100').trim();

        let history = [];

        for (const item of commitHistory.split('\n')) {

            if (isLastItem(item)) {
                break;
            }

            const match = item.match(/^(.*?)\s(.*)$/);

            const res = {
                message: match[2],
                hash: match[1],
                branch: '',
                ticket: '',
                mrTitle: '',
                description: '',
                mrId: Date.now(),
            };

            //get branch & ticket
            const branch = item.match(/Merge branch \'scr(.*?)\'/);
            if (branch) {
                res.branch = branch[1];

                const ticketMatch = res.branch.match(/scr(\d*)/);
                if (!ticketMatch) {
                    continue;
                }
                res.ticket = ticketMatch[1];
            } else {
                const ticketMatch = item.match(/SCR #(\d*)/);
                if (ticketMatch) {
                    res.ticket = ticketMatch[1];
                }
            }

            // make attempt to get branch from gitlab pipeline
            if (!res.branch) {
                const response = this.execNativeShellSync(
                    `curl "https://${gitUrl}/api/v4/projects/${projectId}/`
                    + `repository/commits/${res.hash}?private_token=${apiKey}"`,
                );
                try {
                    const data = JSON.parse(response);
                    const branch = _.get(data, 'last_pipeline.ref');
                    if (branch !== 'master') {
                        res.branch = _.get(data, 'last_pipeline.ref');
                    }
                } catch (error) {
                    //
                }
            }

            // attemp to get merge request data
            let response = this.execNativeShellSync(`curl "https://${gitUrl}/api/v4/projects`
                + `/${projectId}/repository/commits/${res.hash}/merge_requests?state=merged&private_token=${apiKey}"`);

            try {
                const data = JSON.parse(response);
                if (data && data.length) {
                    const mr = data[0];
                    res.mrTitle = _.get(mr, 'title', '');
                    res.description = _.get(mr, 'description', '');
                    res.mrId = _.get(mr, 'id', Date.now());
                }
            } catch (error) {
                //
            }

            if (!res.mrId) {
                if (res.branch) {
                    response = this.execNativeShellSync(`curl "https://${gitUrl}/api/v4/projects`
                        + `/${projectId}/merge_requests?state=merged`
                        + `&source_branch=${res.branch}&private_token=${apiKey}"`);
                } else {
                    const searchText = encodeURIComponent(res.message);
                    response = this.execNativeShellSync(`curl "https://${gitUrl}/api/v4/projects/`
                        + `${projectId}/merge_requests?state=merged&search=${searchText}&private_token=${apiKey}"`);
                }

                try {
                    const data = JSON.parse(response);
                    if (_.isArray(data)) {
                        let mr;
                        if (data.length > 1) {
                            mr = _.find(data, (item) => {
                                return item.merge_commit_sha.indexOf(res.hash) === 0
                                    || item.squash_commit_sha.indexOf(res.hash) === 0;
                            });
                        } else {
                            mr = data[0];
                        }
                        res.mrTitle = _.get(mr, 'title', '');
                        res.description = _.get(mr, 'description', '');
                        res.mrId = _.get(mr, 'id', Date.now());
                    }
                } catch (error) {
                    //
                }
            }

            res.message = res.mrTitle || res.message;

            history.push(res);
        }

        // uniqueness history items
        history = _.uniqBy(history, 'mrId');
        history.forEach((item, index) => {
            if (!item) {
                return;
            }
            const duplicate = _.filter(history, (subItem) => (subItem && (subItem.message === item.message)));
            if (duplicate.length > 1 && !item.branch) {
                delete history[index];
            }
        });
        history = history.filter(i => !!i);

        const date = luxon.DateTime.now().toFormat('dd-LL-yyyy');
        const filePath = `${this.params.paths.changeLogs}/${tag}_${date}.md`,
            relativeFilePath = path.relative(__dirname, filePath),
            relativeDirPath = path.dirname(relativeFilePath);

        if (fs.existsSync(this.params.paths.changeLogs)) {
            // generate history md
            const content = [`## ${tag.replace(/-rc.(\d*)$/, 'RC$1')} (${date})`];
            for (const item of history) {
                const commitTitle = (item.message)
                    .replace(/#(\d+)/, '[#$1](https://tracker.egamings.com/issues/$1)');
                content.push(`### ${commitTitle}${item.description ? '\n\n' + _.trim(item.description) : ''}`);
            }

            const contentText = content.join('\n\n') + '\n';

            // eslint-disable-next-line no-console
            console.log(`\nChanges of release\n\n${contentText}`);

            let response;
            if (content) {
                response = await inquirer.prompt({
                    type: 'confirm',
                    name: 'create',
                    message: `Changes will be saved in ./${relativeFilePath}, continue?`,
                });
            } else {
                response = await inquirer.prompt({
                    type: 'confirm',
                    name: 'create',
                    message: 'No changes, continue?',
                });
            }
            if (!response.create) {
                throw Error('Change logs aborted');
            }

            fs.writeFileSync(filePath, contentText);
            // eslint-disable-next-line no-console
            console.log(`Changes history saved to ${filePath}`);
        } else {
            throw Error(`Directory ./${relativeDirPath} not founded`);
        }

        const minStartDate = luxon.DateTime.now().minus({months: 4});

        if (!isRC) {
            deleteRClogs();
        }

        src([
            `${this.params.paths.changeLogs}/*.md`,
            `!${this.params.paths.changeLogs}/*index.md`,
        ])
            .pipe(sort({
                asc: false,
            }))
            .pipe(customFilter(file => {
                const fileNameInfo = path.basename(file.basename, '.md').split('_');
                const dateInfo = fileNameInfo[1].split('-');
                const fileDate = luxon.DateTime.fromISO(`${dateInfo[2]}-${dateInfo[1]}-${dateInfo[0]}`);
                const interval = luxon.Interval.fromDateTimes(fileDate, fileDate);

                if (interval.isAfter(minStartDate)) {
                    return true;
                }
                return false;
            }))
            .pipe(modifyFile((content, filePath, file) => {

                const fileNameInfo = path.basename(filePath, '.md').split('_');
                const tag = fileNameInfo[0];
                const version = fileNameInfo[0].replace(/-rc.(\d*)$/, 'RC$1');
                const date = fileNameInfo[1];

                return content
                    .replace(
                        new RegExp(`^## ${version} \\(${date}\\)`),
                        `## [${version} (${date})](./9.-change-logs/${tag}-(${date}).html)`,
                    );
            }))
            .pipe(concat('900.change-logs.md'))
            .pipe(dest(this.params.paths.changeLogsDocDist))
            .pipe(markdown())
            .pipe(modifyFile((content, filePath, file) => {
                return `\ufeff<html><head></head><body>${content}</body></html>`;
            }));

        generateSummary();

        done();
    });
};
