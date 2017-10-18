import React from 'react';

const style = require('../styles/subcategory.scss');

const Subcategory = props => (
  <div className={style.subcategory}>
    <div className={style.subcategory__header}>{props.title}</div>
    {props.children}
  </div>
);

export default Subcategory;
