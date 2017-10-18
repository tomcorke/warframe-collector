import React from 'react';

const style = require('../styles/category.scss');

const Category = props => (
  <div className={style.category}>
    <div className={style.category__header}>{props.title}</div>
    {props.children}
  </div>
);

export default Category;
