const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => ({
    entry: {
        'index': './lib/index.ts',
    },
    resolve: { extensions: ['.ts', '.js'] },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, '_bundles'),
        filename: argv.mode === 'production' ? '[name].umd.min.js' : '[name].umd.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/, loader: 'ts-loader',
                include: [
                    path.resolve(__dirname, "lib"), // include only library
                ],
            },

        ]
    },
    performance: { hints: false }, // this disables warning about large output file (in our case its ~300Kb which is fine)
    plugins: [
    ]
});


