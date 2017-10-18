import React from 'react';
import PropTypes from 'prop-types';
import Category from './category';
import Warframe from './warframe';

const style = require('../styles/warframes.scss');

const Warframes = (props) => {
  return (
    <Category title="Warframes">
      {props.data.map(warframe => <Warframe key={warframe.name} data={warframe} />)}
    </Category>
  );
};

Warframes.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};

export default Warframes;
