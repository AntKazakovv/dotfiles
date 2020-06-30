const {task, series} = require('gulp');

module.exports = function defaultTask() {
    if(this.params.isEngineBundle) {
        task('default', series('engineBuild'));
    } else {
        task('default', series('build'));
    }

}
