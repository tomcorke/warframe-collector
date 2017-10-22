const sqlite = require('sqlite3');
const path = require('path');
const uuid = require('uuid/v4');

console.log('Creating database...');
const db = new sqlite.Database(path.resolve(__dirname, '../db.sqlite3'));

function dbExecute(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function dbGet(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function callback(err, row) { // eslint-disable-line prefer-arrow-callback
      if (err) {
        reject(err);
      } else {
        resolve({ statement: this, row });
      }
    });
  });
}

function dbRun(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err, row) { // eslint-disable-line prefer-arrow-callback
      if (err) {
        reject(err);
      } else {
        resolve({ statement: this, row });
      }
    });
  });
}

function init() {
  const sql = `CREATE TABLE IF NOT EXISTS warframe_collection (
    privateKey TEXT PRIMARY KEY,
    publicKey TEXT UNIQUE NOT NULL,
    data TEXT NOT NULL
  ) WITHOUT ROWID`;
  return dbExecute(sql);
}

function loadPrivate(privateKey) {
  const sql = 'SELECT publicKey, data FROM warframe_collection WHERE privateKey=?';
  return dbGet(sql, privateKey)
    .then(({ row }) => {
      return {
        ...row,
        data: JSON.parse(row.data),
        privateKey,
      };
    });
}

function loadPublic(publicKey) {
  const sql = 'SELECT data FROM warframe_collection WHERE publicKey=?';
  return dbGet(sql, publicKey)
    .then(({ row }) => {
      return {
        ...row,
        data: JSON.parse(row.data),
        publicKey,
      };
    });
}

function generateKey() {
  return uuid();
}

function save(privateKey, data) {

  const stringData = typeof data === 'string' ? data : JSON.stringify(data);

  if (privateKey) {
    const sql = 'UPDATE warframe_collection SET data=? WHERE privateKey=?';
    return dbRun(sql, stringData, privateKey)
      .then(() => loadPrivate(privateKey));
  }

  const newPrivateKey = generateKey();
  const publicKey = generateKey();
  const sql = 'INSERT INTO warframe_collection (privateKey, publicKey, data) VALUES (?, ?, ?)';
  return dbRun(sql, newPrivateKey, publicKey, stringData)
    .then(() => loadPrivate(newPrivateKey));
}

module.exports = {
  init,
  loadPrivate,
  loadPublic,
  save,
};
