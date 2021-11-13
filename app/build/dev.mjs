import webpack from 'webpack';
import devServer from 'webpack-dev-server';
import dev_config from './webpack/webpack.dev.js';

const config = webpack(dev_config);

const server = new devServer({
    hot: true,
    liveReload: true,
    port: 5000,
}, config);

(async () => {
    await server.start();
})();