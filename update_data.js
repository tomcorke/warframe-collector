const request = require('request-promise-native');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

function getWeapons() {

  const NAME_BLACKLIST = [
    'Rampart',
    'Artemis Bow',
    'Razorwing',
    'Regulator',
    'Exalted Blade',
    'Hysteria',
    'Primal Fury',
    'Diwata',
    'Peacemaker',
  ];

  const TAB_BLACKLIST = [
    'Research',
    'Prime',
  ];

  const SKIP_SUBCATEGORY_FOR_CATEGORIES = [
    'Sentinel',
  ];

  return request('http://warframe.wikia.com/wiki/Template:WeaponNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const tabs = document.querySelectorAll('#mw-content-text .tabber .tabbertab[title]');
      return Array.from(tabs)
        .filter(tab => !TAB_BLACKLIST.includes(tab.getAttribute('title')))
        .map((tab) => {
          const title = tab.getAttribute('title');
          const itemNodes = tab.querySelectorAll('table.navbox td a[href][title]');
          const items = Array.from(itemNodes)
            .filter(item => !item.getAttribute('title').startsWith('Category'))
            .filter(item => !NAME_BLACKLIST.includes(item.getAttribute('title')))
            .map((item) => {
              const itemData = { name: item.getAttribute('title'), url: item.getAttribute('href') };
              const subcategoryNode = item.parentNode.previousSibling;
              if (subcategoryNode && subcategoryNode.classList && subcategoryNode.classList.contains('navboxgroup') && !SKIP_SUBCATEGORY_FOR_CATEGORIES.includes(title)) {
                itemData.subCategory = subcategoryNode.textContent.trim();
              }
              return itemData;
            })
            .sort((a, b) => (a.name < b.name ? -1 : 1));
          return { category: title, items };
        });
    });
}

function getWarframes() {

  const NAME_BLACKLIST = [
    /^warframe/i,
  ];

  return request('http://warframe.wikia.com/wiki/Template:WarframeNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const frames = document.querySelectorAll('#mw-content-text table.navbox td a[href][title]');
      return Array.from(frames)
        .map(frame => ({ name: frame.getAttribute('title').replace('/', ' '), url: frame.getAttribute('href') }))
        .filter(frame => !NAME_BLACKLIST.some(blacklist => blacklist.test(frame.name)))
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    });
}

Promise.all([
  getWeapons(),
  getWarframes(),
])
  .then(([weapons, warframes]) => ({ weapons, warframes }))
  .then((data) => {
    fs.writeFileSync(path.resolve(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
    fs.writeFileSync(path.resolve(__dirname, 'data', 'data.min.json'), JSON.stringify(data));
  })
  .catch(console.error);
