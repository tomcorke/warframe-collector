const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
        }),
    ],
    devtool: "#source-map"
  }