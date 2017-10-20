const request = require('request-promise-native');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

Array.prototype.indexByProp = function(propertyName, stripProperty = true) {
  return this.reduce((indexed, item) => {
    indexed[item[propertyName]] = item;
    if (stripProperty) {
      delete item[propertyName];
    }
    return indexed;
  }, {});
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
    'Research',
    'Prime',
  ];

  const SKIP_SUBCATEGORY_FOR_CATEGORIES = [];

  const CATEGORY_RENAME = {
    Archwing: 'Archwing Weapons',
  };

  const CATEGORY_SUBCATEGORY_OVERRIDE = {
    Sentinel: 'Weapon',
  };

  return request('http://warframe.wikia.com/wiki/Template:WeaponNav')
    .then(response => new JSDOM(response))
    .then((dom) => {
      const { document } = dom.window;
      const tabs = document.querySelectorAll('#mw-content-text .tabber .tabbertab[title]');

      return Array.from(tabs)
        .filter(tab => !TAB_BLACKLIST.includes(tab.getAttribute('title')))
        .reduce((allItems, tab) => {

          let title = tab.getAttribute('title');
          title = CATEGORY_RENAME[title] || title;
          const itemNodes = tab.querySelectorAll('table.navbox td a[href][title]');

          const items = Array.from(itemNodes)
            .filter(item => !item.getAttribute('title').startsWith('Category'))
            .filter(item => !NAME_BLACKLIST.includes(item.getAttribute('title')))
            .map((item) => {

              const itemData = { category: title, name: item.getAttribute('title'), url: item.getAttribute('href') };
              const subcategoryNode = item.parentNode.previousSibling;

              if (subcategoryNode && subcategoryNode.classList && subcategoryNode.classList.contains('navboxgroup')) {
                const subCategory = CATEGORY_SUBCATEGORY_OVERRIDE[title] || subcategoryNode.textContent.trim();

                if (!subCategory) {
                  console.log(chalk.red('Invalid subcategory found for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.red('"'));
                } else if (SKIP_SUBCATEGORY_FOR_CATEGORIES.includes(title)) {
                  console.log(chalk.yellow('Omitting subcategory "') + chalk.white(subCategory) + chalk.yellow('" by configuration for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.yellow('"'));
                } else {
                  itemData.subCategory = subCategory;
                }
              } else {
                console.log(chalk.magenta('No subcategory found for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.magenta('"'));
              }

              return itemData;
            })
            .sort((a, b) => (a.name < b.name ? -1 : 1));

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
        .map(frame => ({ name: frame.getAttribute('title').replace('/', ' '), url: frame.getAttribute('href') }))
        .filter(frame => !NAME_BLACKLIST.some(blacklist => blacklist.test(frame.name)))
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    });
}

function signedColouredNumber(number) {
  if (number > 0) {
    return chalk.green('+' + number);
  } else if (number < 0) {
    return chalk.red(number);
  } else {
    return chalk.white('+0');
  }
}

Promise.all([
  getWeapons(),
  getWarframes(),
])
  .then(([weapons, warframes]) => {
    console.log(chalk.green('Indexing items by name...'));
    return {
      weapons: weapons.indexByProp('name'),
      warframes: warframes.indexByProp('name'),
    };
  })
  .then((data) => {

    const dataJsonPath = path.resolve(__dirname, 'data', 'data.json');
    const minifiedDataJsonPath = path.resolve(__dirname, 'data', 'data.min.json');

    const warframeCount = Object.keys(data.warframes).length;
    const weaponsCount = Object.keys(data.weapons).length;

    let currentWarframeCount = 0;
    let currentWeaponsCount = 0;

    if (fs.existsSync(dataJsonPath)) {
      // eslint-disable-next-line
      const currentData = require(dataJsonPath);
      currentWarframeCount = Object.keys(currentData.warframes).length;
      currentWeaponsCount = Object.keys(currentData.weapons).length;
    }

    const warframeCountDiff = warframeCount - currentWarframeCount;
    const weaponsCountDiff = weaponsCount - currentWeaponsCount;

    console.log(chalk.white('Found ') + chalk.green(warframeCount) + chalk.white(' (') + signedColouredNumber(warframeCountDiff) + chalk.white(') warframes'));
    console.log(chalk.white('Found ') + chalk.green(weaponsCount) + chalk.white(' (') + signedColouredNumber(weaponsCountDiff) + chalk.white(') weapons'));

    console.log(chalk.green('Writing "') + chalk.white(dataJsonPath) + chalk.green('"'));
    fs.writeFileSync(dataJsonPath, JSON.stringify(data, null, 2));
    console.log(chalk.green('Writing "') + chalk.white(minifiedDataJsonPath) + chalk.green('"'));
    fs.writeFileSync(minifiedDataJsonPath, JSON.stringify(data));
  })
  .catch(console.error);
