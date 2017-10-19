import React from 'react';
import PropTypes from 'prop-types';

import Category from './category';
import Warframe from './warframe';
import './helpers';

const style = require('../styles/warframes.scss');

const Warframes = props => {
  const warframes = Object.keys(props.data)
    .map(name => ({ ...props.data[name], name }))
    .filterByOptions(props.options);

  return (
    <Category title="Warframes">
      {warframes
        .map(warframe => (
          <Warframe
            key={warframe.name}
            data={warframe}
            onChangeProperty={(prop, newValue) => props.onChangeProperty(warframe, prop, newValue)}
          />
        ))}
    </Category>
  );
};

Warframes.propTypes = {
  data: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
  options: PropTypes.shape({
    showOnlyUnmastered: PropTypes.bool,
  }).isRequired,
};

export default Warframes;
