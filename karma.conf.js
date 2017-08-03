module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            require("karma-jasmine"),
            require("karma-typescript"),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
        ],
        files: [
            { pattern: "lib/**/*.ts" },
            { pattern: "test/**/*.ts" }
        ],
        exclude: [
        ],
        preprocessors: {
            "lib/**/*.ts": ["karma-typescript", "coverage"],
            "test/**/*.ts": ["karma-typescript"]
        },
        reporters: ["kjhtml", "progress",],
        browsers: ["Chrome"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [require("karma-typescript-es6-transform")()]
            },
            compilerOptions: {
                "module": "commonjs",
                "target": "es5",
                "lib": ["es2015", "es2017", "dom"],
                "exclude": [
                    "node_modules"
                ]
            },
        },
        port: 9669,
        colors: true,
        autoWatch: true,
        browsers: ["Chrome"],
        singleRun: false,
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        logLevel: config.LOG_ERROR,
    });
};
