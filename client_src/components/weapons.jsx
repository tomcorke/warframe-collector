import React from 'react';
import Category from './category';
import Subcategory from './subcategory';
import MasteryItem from './mastery-item';

const style = require('../styles/weapons.scss');

Array.prototype.getUnique = function getUnique(propertyName) {
  return Array.from(new Set(this.map(item => item[propertyName])));
};

const identity = (x) => x;
const byProp = (propName) => (a, b) => { return a[propName] < b[propName] ? -1 : 1; };

const Weapons = props => {

  const weapons = props.data;

  const mappedWeapons = Object.keys(weapons).map(name => ({ ...weapons[name], name }));

  const categories = mappedWeapons.getUnique('category');

  return categories
    .map(category => {
      const itemsInCategory = mappedWeapons.filter(item => item.category === category).sort(byProp('name'));

      if (props.options && props.options.showSubCategories) {
        const subCategories = itemsInCategory.getUnique('subCategory').sort();

        return {
          category,
          items: subCategories.map(subCategory => {
            const itemsInSubCategory = mappedWeapons.filter(item => item.subCategory === subCategory).sort(byProp('name'));

            return (
              <Subcategory key={subCategory} title={subCategory}>
                {itemsInSubCategory
                  .map(item => <MasteryItem key={item.name} name={item.name} />)}
              </Subcategory>
            );
          }),
        };
      }

      return {
        category,
        items: itemsInCategory
          .map(item => <MasteryItem key={item.name} name={item.name} />),
      };
    })
    .map(({category, items}) => (
      <Category key={category} title={category}>
        {items}
      </Category>
    ));

};

export default Weapons;
