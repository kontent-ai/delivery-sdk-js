const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: './lib/index.ts',
    resolve: { extensions: ['.ts', '.js'] },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, loader: 'awesome-typescript-loader',
                include: [
                    path.resolve(__dirname, "lib"), // include only library
                ],
            },
            {
                test: /\.js$/, loader: 'source-map-loader',
                include: [
                    path.resolve(__dirname, "lib"), // include only library
                ],
            },
        ]
    },
    performance: { hints: false }, // this disables warning about large output file (in our case its ~300Kb which is fine)
    plugins: [
        new webpack.ContextReplacementPlugin(
            // workaround for Parse5
            // fixes WARNING Critical dependency: the request of a dependency is an expression
            /(.+)?parse5(\\|\/)(.+)?/,
            path.join(__dirname, 'lib')
        )
    ]
};


