module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-webpack'),
            require('karma-sourcemap-loader')
        ],
        files: [
            { pattern: 'test/browser/**/*.ts', watched: false }
        ],
        preprocessors: {
            'test/browser/**/*.ts': ['webpack', 'sourcemap']
        },
        reporters: ['kjhtml', 'progress'],
        browsers: ['Chrome'],
        webpack: {
            mode: 'development',
            devtool: 'inline-source-map',
            resolve: {
                extensions: ['.ts', '.js']
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                compilerOptions: {
                                    sourceMap: true
                                }
                            }
                        }
                    }
                ]
            }
        },
        webpackMiddleware: {
            stats: 'errors-only'
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
