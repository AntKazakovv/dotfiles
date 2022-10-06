const exec = require('child_process').exec;

module.exports = class WlcRunCordovaPlugin {
    params = {};
    counter = 0;

    constructor(params) {
        Object.assign(this.params, params);
    }

    apply(compiler) {

        compiler.hooks.done.tap('WlcRunCordovaPlugin', (params) => {
            if (this.counter < 1) {
                this.counter++;
                return;
            }

            exec('npm run cordova:dev:' + this.params.platform, (err, stdout, stderr) => {
                if (stdout) {
                    process.stdout.write(stdout);
                };
                if (stderr) {
                    console.log('\x1b[36m%s\x1b[0m', '\n=======||=======||=======||=======||=======\n');
                    console.log('\x1b[36m%s\x1b[0m', this.params.platform + ' emulator running!');
                    console.log('\x1b[36m%s\x1b[0m', '\n=======||=======||=======||=======||=======\n');
                }
            });
        });
    };
};
