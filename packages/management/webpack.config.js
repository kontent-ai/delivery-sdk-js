const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const libName = 'kontent-management';

module.exports = (env, argv) => ({
    entry: {
        'index': './lib/index.ts',
    },
    resolve: { 
        extensions: ['.ts', '.js'],
    },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, '_bundles'),
        filename: libName + (argv.mode === 'production' ? '.umd.min.js' : '.umd.js'),
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'KontentManagement'
    },
    externals: [{
        'rxjs': {
            commonjs: 'rxjs',
            commonjs2: 'rxjs',
            amd: 'rxjs',
            root: 'rxjs'
        },
        'rxjs/operators': {
            commonjs: 'rxjs/operators',
            commonjs2: 'rxjs/operators',
            amd: 'rxjs/operators',
            root: ['rxjs', 'operators']
        },
    }],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/, 
                loader: 'ts-loader',
                include: [
                    path.resolve(__dirname, 'lib'), // library
                ],
                options: {
                    configFile: require.resolve('./tsconfig.webpack.json')
                }
            },
        ]
    },
    performance: { hints: false }, // this disables warning about large output file (in our case its ~300Kb which is fine)
    plugins: [
        new BundleAnalyzerPlugin({
            generateStatsFile: true,
            analyzerMode: 'disabled',
            statsFilename: 'stats.json'
        })
    ]
});


