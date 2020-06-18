const {task, series} = require('gulp');

function defaultTask() {
    task('default', series('build'));
}

module.exports = defaultTask;
