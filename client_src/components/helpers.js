export function filterByOptions(array, options) {
  let newArray = array.slice();

  if (options.showOnlyUnmastered) {
    newArray = newArray.filter(item => !item.mastered);
  }

  if (options.showOnlyOwned) {
    newArray = newArray.filter(item => item.owned);
  }

  if (options.showOnlyUnowned) {
    newArray = newArray.filter(item => !item.owned && !item.mastered);
  }

  return newArray;
}

Array.prototype.filterByOptions = function filterArrayByOptions(options) {
  return filterByOptions(this, options);
};

export function sortBy(array, propGetter) {
  return array.sort((a, b) => { return propGetter(a) < propGetter(b) ? -1 : 1; });
}

export function sortByProp(array, propName) {
  return sortBy(array, item => item[propName]);
}

Array.prototype.sortBy = function sortArrayBy(propGetter) {
  return sortBy(this, propGetter);
}

Array.prototype.sortByProp = function sortArrayByProp(propName) {
  return sortByProp(this, propName);
};

export function getUnique(array, propName) {
  return Array.from(new Set(array.map(item => item[propName])));
}

Array.prototype.getUnique = function arrayGetUnique(propName) {
  return getUnique(this, propName);
};

export const ITEM_KEY_SELECTOR = item => item.key;
export const ITEM_SAVEDATA_PROPS = ['owned', 'mastered'];
