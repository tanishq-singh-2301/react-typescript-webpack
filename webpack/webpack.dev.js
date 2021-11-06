const commonConfiguration = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "src")
    }
});