const {task, series} = require('gulp');

function defaultTask() {
    if(this.params.isEngineBundle) {
        task('default', series('engineBuild'));
    } else {
        task('default', series('build'));
    }

}

defaultTask.order = 1000;
module.exports = defaultTask;
