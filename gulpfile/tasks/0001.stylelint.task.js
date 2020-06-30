const {task, src} = require('gulp');
const gulpIf = require('gulp-if');
const scssLint = require('gulp-stylelint');
const combine = require('stream-combiner2').obj;
const through2 = require('through2').obj;
const fs = require('fs');

module.exports = function stylelintTask() {
  task('scssLint', () => {

    let stylelintResults = {};

    return src([
      `${this.params.paths.src}/**/*.scss`,
    ])
      .pipe(gulpIf(
        file => {
          return stylelintResults[file.path] && stylelintResults[file.path].mtime == file.stat.mtime.toJSON();
        },
        through2((file, enc, callback) => {
          file.contents = new Buffer(stylelintResults[file.path].contents);
          callback(null, file);
        }),
        combine(
          through2((file, enc, callback) => {
            file.contents = new Buffer(fs.readFileSync(file.path));
            callback(null, file);
          }),
          scssLint({
            reporters: [{
              formatter: 'string',
              console: true,
            }],
            failAfterError: false,
            syntax: 'scss'
          }),
          through2((file, enc, callback) => {
            stylelintResults[file.path] = {
              contents: file.contents,
              mtime: file.stat.mtime
            };
            callback(null, file);
          })
        )
      ))
  });
}
