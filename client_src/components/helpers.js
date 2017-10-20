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

export default {
  filterByOptions,
};
