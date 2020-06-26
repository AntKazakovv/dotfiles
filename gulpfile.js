const gulpTask = require ('./gulpfile/gulpfile');

class gulpFile extends gulpTask {
  constructor(rootDir, type) {
    super(rootDir, type);
  }
}
new gulpFile(__dirname, 'engine');
