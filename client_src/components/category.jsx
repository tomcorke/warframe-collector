import React from 'react';

const style = require('../styles/category.scss');

const Category = props => (<div className={style.category}>{props.children}</div>);

export default Category;
