import Promise from 'promise-polyfill';
import 'whatwg-fetch';
import config from '../config.json';

if (!window.Promise) {
  window.Promise = Promise;
}

export function save(privateKey, publicKey, data = {}) {
}

export function load(privateKey, publicKey) {
  // return fetch(`${config.apiBaseUrl}/load`
  return Promise.reject(Error('No private or public key provided'));
}

export default {
  save,
  load,
};
