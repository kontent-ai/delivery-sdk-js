const path = require('path');

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine"],
        plugins: [
            require("karma-jasmine"),
            require("karma-webpack"),
            require('karma-chrome-launcher'),
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
            "lib/**/*.ts": ["webpack", "coverage"],
            "test-browser/**/*.ts": ["webpack"]
        },
        reporters: ["kjhtml", "progress", "coverage"],
        browsers: ["Chrome"],
        webpack: {
            resolve: { 
                extensions: ['.ts', '.js', '.json'],
            },
            mode: 'development',
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.ts$/, 
                        loader: 'ts-loader',
                        include: [
                            path.resolve(__dirname, 'lib'), // lib
                            path.resolve(__dirname, 'test-browser'), // tests
                        ],
                        options: {
                            configFile: require.resolve('./tsconfig.webpack.json')
                        }
                    },
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
        singleRun: false,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        logLevel: config.LOG_ERROR,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 50000
    });
};
