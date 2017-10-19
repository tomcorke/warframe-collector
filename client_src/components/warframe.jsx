import React from 'react';
import PropTypes from 'prop-types';
import MasteryItem from './mastery-item';

const style = require('../styles/warframe.scss');

const Warframe = props => (
  <div className={style.warframe}>
    <MasteryItem
      data={props.data}
      properties={['owned', 'mastered']}
      onClick={() => props.onChangeProperty('mastered', !props.data.mastered)}
      onChangeProperty={props.onChangeProperty}
    />
  </div>
);

Warframe.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    mastered: PropTypes.bool,
  }).isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

export default Warframe;
