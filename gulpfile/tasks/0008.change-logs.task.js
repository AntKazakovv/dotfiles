const {task, src, dest} = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv,
    _ = require('lodash'),
    rename = require('gulp-rename'),
    inquirer = require('inquirer'),
    sort = require('gulp-sort'),
    modifyFile = require('gulp-modify-file'),
    markdown = require('gulp-markdown'),
    concat = require('gulp-concat'),
    customFilter = require('gulp-custom-filter'),
    luxon = require('luxon');

module.exports = function changeLogsTask() {
    task('change-logs', async (done) => {
        const tag = argv.tag;
        if (!tag) {
            throw Error('Parameter tag (id of release tag) is empty');
        }

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

        const commitHistory = this.execNativeShellSync('git log --oneline --format="%s" -100');
        const history = commitHistory.split('\n');

        let commits = [];
        for (const item of history) {

            const commit = {
                title: item,
                description: '',
                branch: '',
            };

            const scrMatch = item.match(/(#|scr)+([\d-]+)/);
            if (_.isArray(scrMatch)) {
                commit.branch = `scr${scrMatch[2]}`;
            }

            if (_.includes(commit.title, 'SCR #')) {
                const searchText = encodeURIComponent(commit.title);
                const response = this.execNativeShellSync(`curl "https://${gitUrl}/api/v4/projects/`
                    + `${projectId}/merge_requests?state=merged&search=${searchText}&private_token=${apiKey}"`);

                const data = JSON.parse(response);
                if (_.isArray(data)) {
                    commit.description = _.get(data, '[0].description', '');
                }
            } else if (_.includes(commit.title, 'Merge branch')) {
                const sourceBranchArr = /scr[\d-]+/.exec(commit.title);
                if (!_.isArray(sourceBranchArr)) {
                    break;
                }
                const sourceBranch = sourceBranchArr[0];
                const response = this.execNativeShellSync(`curl "https://${gitUrl}/api/v4/projects`
                    + `/${projectId}/merge_requests?state=merged`
                    + `&source_branch=${sourceBranch}&private_token=${apiKey}"`);
                const data = JSON.parse(response);
                if (_.isArray(data)) {
                    commit.title = _.get(data, '[0].title', '');
                    commit.description = _.get(data, '[0].description', '');
                }
            } else if (_.includes(item, 'Updated for release')) {
                break;
            }
            commits.push(commit);
        }
        commits = _.uniqBy(commits, 'branch');

        const filePath = `${this.params.paths.changeLogs}/${tag}_${luxon.DateTime.now().toFormat('dd-LL-yyyy')}.md`,
            relativeFilePath = path.relative(__dirname, filePath),
            relativeDirPath = path.dirname(relativeFilePath);

        if (fs.existsSync(this.params.paths.changeLogs)) {

            let content = '';
            for (const commit of commits) {
                const commitTitle = commit.title.replace(/#(\d+)/, '[#$1](https://tracker.egamings.com/issues/$1)');
                content += `### ${commitTitle}${commit.description ? '\n' + _.trim(commit.description) : ''}\n\n`;
            }
            // eslint-disable-next-line no-console
            console.log(`\nChanges of release\n\n${content}`);

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

            fs.writeFileSync(filePath, content);
            // eslint-disable-next-line no-console
            console.log(`Changes history saved to ${filePath}`);
        } else {
            throw Error(`Directory ./${relativeDirPath} not founded`);
        }

        const minStartDate = luxon.DateTime.now().minus({months: 4});

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
                const date = fileNameInfo[1];
                return `## ${tag} (${date})\n\n${content}`;
            }))
            .pipe(concat('900.change-logs.md'))
            .pipe(dest(this.params.paths.changeLogsDocDist))
            .pipe(markdown())
            .pipe(modifyFile((content, filePath, file) => {
                return `\ufeff<html><head></head><body>${content}</body></html>`;
            }));

        done();
    });
};
