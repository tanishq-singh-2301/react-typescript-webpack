const commonConfiguration = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(commonConfiguration, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimize: true,
    }
});