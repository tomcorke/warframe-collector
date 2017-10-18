import React from 'react';
import PropTypes from 'prop-types';
import MasteryItem from './mastery-item';

const style = require('../styles/warframe.scss');

const Warframe = props => (
  <div className={style.warframe}>
    <MasteryItem name={props.data.name} />
  </div>
);

Warframe.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Warframe;
