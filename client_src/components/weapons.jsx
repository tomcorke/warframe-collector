import React from 'react';
import Category from './category';
import Subcategory from './subcategory';
import MasteryItem from './mastery-item';

const style = require('../styles/weapons.scss');

const identity = (x) => x;
const byProp = (propName) => (a, b) => { return a[propName] < b[propName] ? -1 : 1; };

const Weapons = props => {
  return (
    <div className={style.weapons}>
      {props.data.map(category => {
        const subCategories = Array.from(new Set(category.items.map(item => item.subCategory).filter(identity))).sort();
        subCategories.push(undefined);
        return (
          <Category key={category.category} title={category.category}>
            {subCategories.map(subCategory => {
              const items = category.items.filter(item => item.subCategory === subCategory).sort(byProp('name'));
              return (
                <Subcategory key={subCategory} title={subCategory}>
                  {items.map(item => <MasteryItem key={item.name} name={item.name} />)}
                </Subcategory>
              );
            })}
          </Category>
        );
      })}
    </div>
  );
};

export default Weapons;
