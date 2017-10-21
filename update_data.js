const request = require('request-promise-native');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

Array.prototype.indexByProp = function indexByProp(prop, stripProperty = true) {
  return this.reduce((indexed, item) => {
    indexed[item[prop]] = item; // eslint-disable-line no-param-reassign
    if (stripProperty) {
      delete item[prop]; // eslint-disable-line no-param-reassign
    }
    return indexed;
  }, {});
};
Array.prototype.sortByProp = function sortByProp(prop) {
  return this.sort((a, b) => { return a[prop] < b[prop] ? -1 : 1; });
};
Array.prototype.getUnique = function getUnique() {
  return Array.from(new Set(this));
}

function getWeapons() {
  console.log(chalk.green('Getting weapons...'));

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
    'Maneuvers',
    'Melee',
  ];

  const TAB_BLACKLIST = [
    'Archwing',
    'Research',
    'Prime',
  ];

  return request('http://warframe.wikia.com/wiki/Template:WeaponNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const tabs = document.querySelectorAll('#mw-content-text .tabber .tabbertab[title]');

      return Array.from(tabs)
        .filter(tab => !TAB_BLACKLIST.includes(tab.getAttribute('title')))
        .reduce((allItems, tab) => {

          const title = tab.getAttribute('title');
          const itemNodes = tab.querySelectorAll('table.navbox td a[href][title]');

          const items = Array.from(itemNodes)
            .filter(item => !item.getAttribute('title').startsWith('Category'))
            .filter(item => !NAME_BLACKLIST.includes(item.getAttribute('title')))
            .map((item) => {

              const itemData = {
                category: title,
                name: item.getAttribute('title'),
                url: item.getAttribute('href'),
              };
              const subcategoryNode = item.parentNode.previousElementSibling;

              if (subcategoryNode && subcategoryNode.classList && subcategoryNode.classList.contains('navboxgroup')) {
                const subcategory = subcategoryNode.textContent.trim();

                if (!subcategory) {
                  console.log(chalk.red('Invalid subcategory found for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.red('"'));
                } else {
                  itemData.subcategory = subcategory;
                }
              } else {
                console.log(chalk.magenta('No subcategory found for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.magenta('"'));
              }

              return itemData;
            })
            .sortByProp('name');

          return allItems.concat(items);

        }, []);
    });
}

function getWarframes() {
  console.log(chalk.green('Getting warframes...'));
  const NAME_BLACKLIST = [
    /^warframe/i,
  ];

  return request('http://warframe.wikia.com/wiki/Template:WarframeNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const frames = document.querySelectorAll('#mw-content-text table.navbox td:not(.navboxfooter) a[href][title]');
      return Array.from(frames)
        .map(frame => {
          const itemData = {
            name: frame.getAttribute('title').replace('/', ' '),
            url: frame.getAttribute('href'),
          };
          return itemData;
        })
        .filter(frame => !NAME_BLACKLIST.some(blacklist => blacklist.test(frame.name)))
        .sortByProp('name');
    });
}

function getArchwings() {
  console.log(chalk.green('Getting archwings...'));

  return request('http://warframe.wikia.com/wiki/Template:ArchwingNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const tabs = document.querySelectorAll('#mw-content-text .tabber .tabbertab[title]');


      return Array.from(tabs)
        .reduce((allItems, tab) => {

          const title = tab.getAttribute('title');
          const itemNodes = tab.querySelectorAll('table.navbox td a[href][title]');

          const items = Array.from(itemNodes)
            .filter(item => !item.getAttribute('title').startsWith('Category'))
            .map((item) => {
              const itemData = {
                subcategory: title,
                name: item.getAttribute('title').replace('/', ' '),
                url: item.getAttribute('href'),
              };
              return itemData;
            })
            .sortByProp('name');

          return allItems.concat(items);

        }, []);
    });
}

function getCompanions() {
  console.log(chalk.green('Getting companions...'));

  return request('http://warframe.wikia.com/wiki/Template:CompanionNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const companions = document.querySelectorAll('#mw-content-text table.navbox td:not(.navboxfooter) a[href][title]');
      return Array.from(companions)
        .map(companion => {
          const itemData = {
            name: companion.getAttribute('title').replace('/', ' '),
            url: companion.getAttribute('href'),
          };

          // td > th.navboxhead > a
          // td > tr > a (item)
          const categoryNode = companion.parentNode.parentNode.previousElementSibling.querySelector('th.navboxhead a[title][href]');
          if (categoryNode) {
            const category = categoryNode.getAttribute('title');
            itemData.subcategory = category;
          }

          return itemData;
        })
        .sortByProp('name');
    });
}

function signedColouredNumber(number) {
  if (number > 0) {
    return chalk.green(`+${number}`);
  } else if (number < 0) {
    return chalk.red(`${number}`);
  }
  return chalk.gray('0');
}

Promise.all([
  getWeapons(),
  getWarframes(),
  getArchwings(),
  getCompanions(),
])
  .then(([weapons, warframes, archwings, companions]) => {
    return {
      weapons,
      warframes,
      archwings,
      companions,
    };
  })
  .then((data) => {
    console.log(chalk.green('Reorganising sentinel weapons into companions category...'));

    const sentinelWeapons = data.weapons.filter(weapon => weapon.category === 'Sentinel');
    sentinelWeapons.forEach(weapon => {
      const index = data.weapons.indexOf(weapon);
      data.weapons.splice(index, 1);

      const newWeapon = Object.assign({}, weapon);
      delete newWeapon.category;
      newWeapon.subcategory = 'Sentinel Weapons';

      data.companions.push(newWeapon);
    });

    return data;
  })
  .then((data) => {

    console.log(chalk.green('Indexing items by name...'));
    return Object.assign(
      {},
      data,
      {
        weapons: data.weapons.indexByProp('name'),
        warframes: data.warframes.indexByProp('name'),
        archwings: data.archwings.indexByProp('name'),
        companions: data.companions.indexByProp('name'),
      },
    );
  })
  .then((data) => {

    const dataJsonPath = path.resolve(__dirname, 'data', 'data.json');
    const minifiedDataJsonPath = path.resolve(__dirname, 'data', 'data.min.json');

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const existingData = fs.existsSync(dataJsonPath) ? require(dataJsonPath) : {};
    const types = Object.keys(data).concat(Object.keys(existingData)).getUnique();

    types.forEach(type => {
      const existingDataForType = existingData[type] || {};
      const newData = data[type] || {};

      const newCount = Object.keys(newData).length;

      const allItemNames = Object.keys(newData).concat(Object.keys(existingDataForType)).getUnique();

      const changeCount = allItemNames
        .reduce(({ added, modified, removed }, name) => {
          const newItem = newData[name];
          const existingItem = existingDataForType[name];

          if (newItem && !existingItem) {
            added += 1; // eslint-disable-line no-param-reassign
          } else if (existingItem && !newItem) {
            removed -= 1; // eslint-disable-line no-param-reassign
          } else if (JSON.stringify(newItem) !== JSON.stringify(existingItem)) {
            modified += 1; // eslint-disable-line no-param-reassign
          }

          return { added, modified, removed };

        }, { added: 0, modified: 0, removed: 0 });

      console.log([
        chalk.white('Found '),
        chalk.green(newCount),
        chalk.white(' ('),
        signedColouredNumber(changeCount.added),
        chalk.white('/'),
        signedColouredNumber(changeCount.modified),
        chalk.white('/'),
        signedColouredNumber(changeCount.removed),
        chalk.white(`) ${type}`),
      ].join(''));
    });

    console.log(chalk.white('Writing ') + chalk.green(dataJsonPath) + chalk.white('...'));
    fs.writeFileSync(dataJsonPath, JSON.stringify(data, null, 2));
    console.log(chalk.white('Writing ') + chalk.green(minifiedDataJsonPath) + chalk.white('...'));
    fs.writeFileSync(minifiedDataJsonPath, JSON.stringify(data));
  })
  .catch(console.error);
