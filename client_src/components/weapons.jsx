import React from 'react';
import Category from './category';
import Subcategory from './subcategory';
import MasteryItem from './mastery-item';

const style = require('../styles/weapons.scss');

const identity = (x) => x;
const byProp = (propName) => (a, b) => { return a[propName] < b[propName] ? -1 : 1; };

const Weapons = props => {

  const weapons = props.data.map(category => {

    let itemsInCategory;

    if (props.options && props.options.showSubCategories) {

      const subCategories = Array.from(new Set(category.items.map(item => item.subCategory))).sort();

      itemsInCategory = subCategories.map(subCategory => {
        const items = category.items.filter(item => item.subCategory === subCategory).sort(byProp('name'));
        return (
          <Subcategory key={subCategory} title={subCategory}>
            {items.map(item => <MasteryItem key={item.name} name={item.name} />)}
          </Subcategory>
        );
      });

    } else {

      itemsInCategory = category.items.map(item => <MasteryItem key={item.name} name={item.name} />);

    }

    return (
      <Category key={category.category} title={category.category}>
        {itemsInCategory}
      </Category>
    );

  });

  return weapons;
};

export default Weapons;
