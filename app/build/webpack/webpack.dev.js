const commonConfiguration = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devtool: 'source-map',
    watch: true
});

// webpack serve --config ./app/build/webpack/webpack.dev.js