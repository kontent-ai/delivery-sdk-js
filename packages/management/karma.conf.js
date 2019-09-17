module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            require("karma-jasmine"),
            require("karma-typescript"),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
        ],
        files: [
            { pattern: "lib/**/*.ts" },
            { pattern: "test-browser/**/*.ts" }
        ],
        exclude: [
        ],
        preprocessors: {
            "lib/**/*.ts": ["karma-typescript"],
            "test-browser/**/*.ts": ["karma-typescript"]
        },
        reporters: ["kjhtml", "progress", "karma-typescript"],
        browsers: ["Chrome"],
        karmaTypescriptConfig: {
            compilerOptions: {
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                resolveJsonModule: true,
                module: "commonjs",
                sourceMap: true,
                target: "ES5"
            },
            exclude: ["node_modules"],
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")()
                ]
            }
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
        singleRun: false,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        logLevel: config.DEBUG,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 5000000
    });
};
