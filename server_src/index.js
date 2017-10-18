const express = require('express');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const compression = require('compression');
const readline = require('readline');
const keypress = require('keypress');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
keypress(process.stdin);

const app = express();
app.use(compression());

const templateCache = {};
function getTemplate(name, skipCache = false) {
  if (templateCache[name] && !skipCache) { return templateCache[name]; }
  const templatePath = path.resolve(__dirname, '../templates', `${name}`);
  if (fs.existsSync(templatePath)) {
    const fileContents = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(fileContents);
    templateCache[name] = template;
    return template;
  }
  throw Error(`Template file not found: "${templatePath}"`);
}

const lastUpdate = Date.now();
app.get('/last', (req, res) => {
  res.status(200).json(lastUpdate);
});

app.get('/', (req, res) => {
  const template = getTemplate('index.html', req.query.noCache);
  const context = {}
  res.send(template(context));
});

app.get('/data.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../data/data.min.json'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client_dist/bundle.js'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

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
