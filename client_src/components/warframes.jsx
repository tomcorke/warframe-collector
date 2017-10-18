import React from 'react';
import PropTypes from 'prop-types';
import Warframe from './warframe';

const style = require('../styles/warframes.scss');

const Warframes = (props) => {
  return (
    <div className={style.warframes}>
      {props.data.map(warframe => <Warframe key={warframe.name} data={warframe} />)}
    </div>
  );
};

Warframes.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};

export default Warframes;
