import React from 'react';
import PropTypes from 'prop-types';

import { Category, Subcategory } from './category';
import MasteryItem from './masteryItem';
import './helpers';

const style = require('../styles/items.scss');

const ItemGroup = ({
  itemCategory,
  items = {},
  options = {},
  onChangeProperty = () => {},
}) => {

  const filteredItems = Object.keys(items)
    .map(name => ({ ...items[name], name }))
    .filterByOptions(options);

  const categories = filteredItems.getUnique('category')
    .map(category => ({
      title: category || itemCategory,
      name: category,
    }));

  function createItemComponent(item) {
    return (
      <MasteryItem
        key={item.name}
        item={item}
        onChangeProperty={(prop, newValue) => onChangeProperty(item, prop, newValue)}
      />
    );
  }

  return categories
    .map(({ title: categoryTitle, name: categoryName }) => {

      const itemsInCategory = filteredItems.filter(item => {
        return !categoryName || item.category === categoryName;
      }).sortByProp('name');

      if (options.showSubCategories) {
        const subcategories = itemsInCategory.getUnique('subcategory').sort();

        if (subcategories.length > 0) {

          return {
            categoryTitle,
            items: subcategories.map(subcategory => {
              const itemsInSubcategory = itemsInCategory
                .filter(item => item.subcategory === subcategory)
                .sortByProp('name');

              return (
                <Subcategory key={subcategory || 'default'} title={subcategory}>
                  {itemsInSubcategory.map(createItemComponent)}
                </Subcategory>
              );
            }),
          };

        }
      }

      return {
        categoryTitle,
        items: itemsInCategory.map(createItemComponent),
      };
    })
    .map(({ categoryTitle, items }) => (
      <Category key={categoryTitle} title={categoryTitle}>
        {items}
      </Category>
    ));
};

ItemGroup.propTypes = {
  items: PropTypes.shape().isRequired,
  options: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

export default ItemGroup;
