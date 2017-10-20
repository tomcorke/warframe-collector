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

export function sortByProp(array, propName) {
  return array.sort((a, b) => { return a[propName] < b[propName] ? -1 : 1; });
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

export default {
  filterByOptions,
  sortByProp,
  getUnique,
};
