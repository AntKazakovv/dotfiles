// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
    config.set({
        basePath: '/',
        frameworks: ['jasmine', 'viewport', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-viewport'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        viewport: {
            breakpoints: [
                {
                    name: 'mobile',
                    size: {
                        width: 320,
                        height: 480,
                    },
                },
                {
                    name: 'tablet',
                    size: {
                        width: 768,
                        height: 1024,
                    },
                },
                {
                    name: 'screen',
                    size: {
                        width: 1440,
                        height: 900,
                    },
                },
            ],
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../../coverage/wlc-engine'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_ERROR,
        proxies: {
            '/gstatic/': {
                'target': 'https://static.egamings.com/',
                'changeOrigin': true,
            },
        },
        browsers: ['WlcChromeHeadless'],
        customLaunchers: {
            WlcChromeHeadless: {
                base: 'ChromiumHeadless',
                flags: [
                    '--no-sandbox',
                    '--allow-file-access-from-files',
                    '--disable-web-security',
                    '--enable-experimental-web-platform-features',
                ],
            },
            WlcChrome: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--allow-file-access-from-files',
                    '--disable-web-security',
                    '--enable-experimental-web-platform-features',
                ],
            },
        },
        singleRun: true,
        autoWatch: false,
        restartOnFileChange: false,
    });
};
