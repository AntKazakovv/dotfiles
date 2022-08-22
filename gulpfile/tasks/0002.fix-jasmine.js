const {task} = require('gulp');
const fs = require('fs');

module.exports = function fixJasmine() {
    task('fix-jasmine', (cb) => {
	try {
            const path = fs.realpathSync(`${process.env.INIT_CWD}/node_modules/jasmine/package.json`);
            const file = fs.readFileSync(path).toString();
            const json = JSON.parse(file);
            delete json.exports;
            fs.writeFileSync(path, JSON.stringify(json, null, 4));
	} catch {
	    console.warn('Please run npx gulp fix-jasmine manually');	
	}
        cb();
    });
};
