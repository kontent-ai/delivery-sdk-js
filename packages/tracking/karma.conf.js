module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            require("karma-jasmine"),
            require("karma-typescript"),
            require('karma-firefox-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
        ],
        files: [
            { pattern: "lib/**/*.ts" },
            { pattern: "test-browser/**/*.ts" }
        ],
        exclude: [
        ],
        preprocessors: {
            "lib/**/*.ts": ["karma-typescript", "coverage"],
            "test-browser/**/*.ts": ["karma-typescript"]
        },
        reporters: ["kjhtml", "progress", "coverage"],
        browsers: ["Firefox"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [require("karma-typescript-es6-transform")()]
            },
            compilerOptions: {
                "module": "commonjs",
                "target": "es6", // use es6 only for karma compiler (using es6 will help increase coverage because less junk code required for es5 is needed)
                "lib": ["es2015", "es2017", "dom"],
                "exclude": [
                    "node_modules"
                ]
            },
        },
        coverageReporter: {
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcov', subdir: 'lcov' },
                { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' }
            ]
        },
        port: 9669,
        colors: true,
        autoWatch: true,
        browsers: ["Firefox"],
        singleRun: false,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        logLevel: config.LOG_ERROR,
    });
};
