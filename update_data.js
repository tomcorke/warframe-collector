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
              const subcategoryNode = item.parentNode.previousElementSibling;

              if (subcategoryNode && subcategoryNode.classList && subcategoryNode.classList.contains('navboxgroup')) {
                const subcategory = CATEGORY_SUBCATEGORY_OVERRIDE[title] || subcategoryNode.textContent.trim();

                if (!subcategory) {
                  console.log(chalk.red('Invalid subcategory found for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.red('"'));
                } else if (SKIP_SUBCATEGORY_FOR_CATEGORIES.includes(title)) {
                  console.log(chalk.yellow('Omitting subcategory "') + chalk.white(subcategory) + chalk.yellow('" by configuration for item "') + chalk.white(`${title} / ${itemData.name}`) + chalk.yellow('"'));
                } else {
                  itemData.subcategory = subcategory;
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
        .map(frame => {
          const itemData = { name: frame.getAttribute('title').replace('/', ' '), url: frame.getAttribute('href') };
          return itemData;
        })
        .filter(frame => !NAME_BLACKLIST.some(blacklist => blacklist.test(frame.name)))
        .sort((a, b) => (a.name < b.name ? -1 : 1));
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
          const itemData = { name: companion.getAttribute('title').replace('/', ' '), url: companion.getAttribute('href') };

          // td > th > a
          // td > tr > a
          const categoryNode = companion.parentNode.parentNode.previousElementSibling.querySelector('th.navboxhead a[title][href]');
          if (categoryNode) {
            const category = categoryNode.getAttribute('title');
            itemData.subcategory = category;
          }

          return itemData;
        })
        // .filter(companion => !NAME_BLACKLIST.some(blacklist => blacklist.test(companion.name)))
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    });
}

function signedColouredNumber(number) {
  if (number > 0) {
    return chalk.green(`+${number}`);
  } else if (number < 0) {
    return chalk.red(`${number}`);
  }
  return chalk.white('+0');
}

Promise.all([
  getWeapons(),
  getWarframes(),
  getCompanions(),
])
  .then(([weapons, warframes, companions]) => {
    console.log(chalk.green('Indexing items by name...'));
    return {
      weapons: weapons.indexByProp('name'),
      warframes: warframes.indexByProp('name'),
      companions: companions.indexByProp('name'),
    };
  })
  .then((data) => {

    const dataJsonPath = path.resolve(__dirname, 'data', 'data.json');
    const minifiedDataJsonPath = path.resolve(__dirname, 'data', 'data.min.json');

    const warframeCount = Object.keys(data.warframes).length;
    const weaponsCount = Object.keys(data.weapons).length;
    const companionCount = Object.keys(data.companions).length;

    let currentWarframeCount = 0;
    let currentWeaponsCount = 0;
    let currentCompanionCount = 0;

    if (fs.existsSync(dataJsonPath)) {
      // eslint-disable-next-line
      const currentData = require(dataJsonPath);
      currentWarframeCount = currentData.warframes ? Object.keys(currentData.warframes).length : 0;
      currentWeaponsCount = currentData.weapons ? Object.keys(currentData.weapons).length : 0;
      currentCompanionCount = currentData.companions ? Object.keys(currentData.companions).length : 0;
    }

    const warframeCountDiff = warframeCount - currentWarframeCount;
    const weaponsCountDiff = weaponsCount - currentWeaponsCount;
    const companionCountDiff = companionCount - currentCompanionCount;

    console.log(chalk.white('Found ') + chalk.green(warframeCount) + chalk.white(' (') + signedColouredNumber(warframeCountDiff) + chalk.white(') warframes'));
    console.log(chalk.white('Found ') + chalk.green(weaponsCount) + chalk.white(' (') + signedColouredNumber(weaponsCountDiff) + chalk.white(') weapons'));
    console.log(chalk.white('Found ') + chalk.green(companionCount) + chalk.white(' (') + signedColouredNumber(companionCountDiff) + chalk.white(') compaions'));

    console.log(chalk.green('Writing "') + chalk.white(dataJsonPath) + chalk.green('"'));
    fs.writeFileSync(dataJsonPath, JSON.stringify(data, null, 2));
    console.log(chalk.green('Writing "') + chalk.white(minifiedDataJsonPath) + chalk.green('"'));
    fs.writeFileSync(minifiedDataJsonPath, JSON.stringify(data));
  })
  .catch(console.error);
