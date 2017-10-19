import React from 'react';
import PropTypes from 'prop-types';
import MasteryItem from './mastery-item';

const style = require('../styles/warframe.scss');

const Warframe = props => (
  <div className={style.warframe}>
    <MasteryItem
      name={props.name}
      mastered={props.data.mastered}
      onClick={props.onClick}
    />
  </div>
);

Warframe.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.shape({
    mastered: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Warframe;
