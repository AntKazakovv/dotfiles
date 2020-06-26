const {task, series} = require('gulp');

function defaultTask() {
    task('default', series('dist'));
}

module.exports = defaultTask;
