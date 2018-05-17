const path = require('path');
const webpack = require('webpack');

const libName = 'kentico-cloud-delivery-sdk.browser';

module.exports = (env, argv) => ({
    entry: {
        'index': './lib/index.ts',
    },
    externals: ['parse5', /^parse5\//], // exclude parse5 from browser bundle
    resolve: { extensions: ['.ts', '.js'] },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, '_bundles'),
        filename: libName + (argv.mode === 'production' ? '.umd.min.js' : '.umd.js'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/, loader: 'ts-loader',
                include: [
                    path.resolve(__dirname, 'lib'), // library
                ],
            },  
        ]
    },
    performance: { hints: false }, // this disables warning about large output file (in our case its ~300Kb which is fine)
    plugins: [
        /* Replaces parser adapter with parser browser adapter */
        new webpack.NormalModuleReplacementPlugin(
            /parser-adapter\.ts/,
            'parser-browser-adapter.ts'
          ),
    ]
});


