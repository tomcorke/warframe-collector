import React from 'react';
import PropTypes from 'prop-types';
import Category from './category';
import Warframe from './warframe';

const style = require('../styles/warframes.scss');

class Warframes extends React.Component {

  constructor(props) {
    super(props);
    this.onWarframeClick = this.onWarframeClick.bind(this);
  }

  onWarframeClick(name) {
    this.props.onClick(name);
  }

  render() {
    return (
      <Category title="Warframes">
        {Object.keys(this.props.data)
          .map(name => (
            <Warframe
              key={name}
              name={name}
              data={this.props.data[name]}
              onClick={() => this.onWarframeClick(name)}
            />
          ))}
      </Category>
    );
  }

}

Warframes.propTypes = {
  data: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Warframes;
