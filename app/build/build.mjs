import chalk from 'chalk';
import webpack from 'webpack';
import ora from 'ora';
import webpack_prod from './webpack/webpack.prod.js';

console.clear();
var spinner = ora('Building for production');
spinner.start();

webpack(webpack_prod, (err, stats) => {
    spinner.stop();
    if (err) throw err;

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTPS server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
});