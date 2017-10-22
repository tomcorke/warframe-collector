const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const watch = require('node-watch');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const config = require('./config.json');
const server = require('./server_src');

const readline = require('readline');
const keypress = require('keypress');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
keypress(process.stdin);

server.run(config);

function rebuild(compiler) {
  console.log('Rebuilding client_src...');
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString({
          chunks: false,
          modules: false,
          colors: true,
        }));
        resolve(stats);
      }
    });
  });
}


if (argv.watch) {
  const clientSrcPath = path.resolve(__dirname, 'client_src');
  const compiler = webpack(webpackConfig);
  rebuild(compiler)
    .catch(console.error)
    .then(() => {
      console.log(`Watching ${clientSrcPath} for changes`);
      watch(clientSrcPath, { recursive: true }, () => {
        rebuild(compiler);
      });
    });
}

function shutdown() {
  console.log('Exiting');
  process.exit();
}

function forceUpdate() {
}

process.on('SIGINT', shutdown);
rl.on('SIGINT', shutdown);
process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name === 'r') {
    forceUpdate();
  }
});
