const {task, series} = require('gulp');

module.exports = function defaultTask() {
    if(this.params.isEngineBundle) {
        task('default', series('engineBuild'));
    } else if (this.params.isMobileAppBundle) {
        task('default', series('cordovaBuild'));
    } else {
        task('default', series('dist'));
    }
};
