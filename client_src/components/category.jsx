import React from 'react';

const style = require('../styles/category.scss');

export const Subcategory = props => (
  <div className={style.subcategory}>
    <div key="header" className={style.subcategory__header}>{props.title}</div>
    <div key="content" className={style.subcategory__content}>
      {props.children}
    </div>
  </div>
);

export const Category = props => (
  <div className={style.category}>
    <div key="header" className={style.category__header}>{props.title}</div>
    <div key="content" className={style.category__content}>
      {props.children}
    </div>
  </div>
);
