const {task} = require('gulp');
const fs = require('fs');

module.exports = function githookTask() {
    task('githook:commit-msg', (cb) => {
        const currentBranch = this.execNativeShellSync('git rev-parse --abbrev-ref HEAD').trim();

        if (!/^scr\d+/.test(currentBranch)) {
            cb();
            return true;
        }

        const ticketNumber = currentBranch.match(/^scr(\d+)/)[1].trim();

        const commitMessage = fs.readFileSync(
            process.argv[process.argv.length - 1] || '.git/COMMIT_EDITMSG')
            .toString();

        const re = new RegExp(
            `^SCR #(${ticketNumber}) - (major|BREAKING CHANGE|minor|feat|patch|fix|docs|test|refactor|chore):.+`,
        );

        if (!re.test(commitMessage)) {
            const message = '\n\x1b[31mBad commit message\x1b[0m\n'
                + 'The commit-message should contain the number of ticket corresponding branch and type prefix\n'
                + `Current branch is \x1b[33m${currentBranch}\x1b[0m\n`
                + `See example: \x1b[32mSCR #${ticketNumber} - feat: subject of the ticket\x1b[0m\n`
                + 'More details: \n - https://wiki.egamings.com/display/GS/Tasks+workflow\n'
                + ' - https://www.conventionalcommits.org/en/v1.0.0/\n';

            // eslint-disable-next-line no-console
            console.log(message);
            return false;
        }
        cb();
    });
};
