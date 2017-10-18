import React from 'react';

const style = require('../styles/weapons.scss');

const Weapons = props => (<div className={style.weapons}>{props.children}</div>);

export default Weapons;
