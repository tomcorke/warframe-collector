import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

function fetchData() {
  return fetch('data.json')
    .then(data => data.json());
}

fetchData()
  .then((data) => {
    ReactDOM.render(
      <App data={data} />,
      document.getElementById('app'),
    );
  });
