import React from 'react';
import PropTypes from 'prop-types';

import Category from './category';
import Subcategory from './subcategory';
import MasteryItem from './mastery-item';
import './helpers';

const style = require('../styles/weapons.scss');

Array.prototype.getUnique = function getUnique(propertyName) {
  return Array.from(new Set(this.map(item => item[propertyName])));
};

const byProp = (propName) => (a, b) => { return a[propName] < b[propName] ? -1 : 1; };

const Weapon = props => (
  <div className={style.weapon}>
    <MasteryItem
      data={props.data}
      properties={['owned', 'mastered']}
      onClick={() => props.onChangeProperty('mastered', !props.data.mastered)}
      onChangeProperty={props.onChangeProperty}
    />
  </div>
);

Weapon.propTypes = {
  data: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

const Weapons = props => {
  const weapons = props.data;

  const mappedWeapons = Object.keys(weapons)
    .map(name => ({ ...weapons[name], name }))
    .filterByOptions(props.options);

  const categories = mappedWeapons.getUnique('category');

  const createWeaponComponent = (item) => (
    <Weapon
      key={item.name}
      data={item}
      onChangeProperty={(prop, newValue) => props.onChangeProperty(item, prop, newValue)}
    />
  );

  return categories
    .map(category => {
      const itemsInCategory = mappedWeapons.filter(item => item.category === category).sort(byProp('name'));

      if (props.options && props.options.showSubCategories) {
        const subCategories = itemsInCategory.getUnique('subCategory').sort();

        return {
          category,
          items: subCategories.map(subCategory => {
            const itemsInSubCategory = itemsInCategory.filter(item => item.subCategory === subCategory).sort(byProp('name'));

            return (
              <Subcategory key={subCategory} title={subCategory}>
                {itemsInSubCategory.map(createWeaponComponent)}
              </Subcategory>
            );
          }),
        };
      }

      return {
        category,
        items: itemsInCategory.map(createWeaponComponent),
      };
    })
    .map(({ category, items }) => (
      <Category key={category} title={category}>
        {items}
      </Category>
    ));
};

Weapons.propTypes = {
  data: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

export default Weapons;
