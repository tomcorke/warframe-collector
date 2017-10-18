const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const watch = require('node-watch');
const webpack = require('webpack');

require('./server_src');

if (argv.watch) {

    function rebuild() {
        console.log('Rebuilding client_src...');
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(stats.toString({
                        chunks: false,
                        modules: false,
                        colors: true
                    }));
                    resolve(stats);
                }
            });
        });
    }

    const clientSrcPath = path.resolve(__dirname, 'client_src');
    const compiler = webpack(require('./webpack.config.js'));

    rebuild()
        .catch(console.error)
        .then(() => {
            console.log(`Watching ${clientSrcPath} for changes`);
            watch(clientSrcPath, { recursive: true }, () => {
                rebuild();
            });
        });
}