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
            { pattern: "test/setup/*.ts" },
            { pattern: "dev-test/**/*.ts" }
        ],
        exclude: [
        ],
        preprocessors: {
            "lib/**/*.ts": ["karma-typescript", "coverage"],
            "test/setup/*.ts": ["karma-typescript"],
            "dev-test/**/*.ts": ["karma-typescript"]
        },
        reporters: ["kjhtml", "progress", "coverage"],
        browsers: ["Firefox"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [require("karma-typescript-es6-transform")()]
            },
            compilerOptions: {
                "module": "commonjs",
                "target": "es6",
                "lib": ["es2015", "es2017", "dom"],
                "exclude": [
                    "node_modules"
                ]
            },
        },
        port: 9668,
        colors: true,
        autoWatch: true,
        browsers: ["Firefox"],
        singleRun: false,
        logLevel: config.LOG_ERROR,
    });
};
