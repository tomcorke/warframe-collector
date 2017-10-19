import React from 'react';
import PropTypes from 'prop-types';

import Options from './options';
import Warframes from './warframes';
import Weapons from './weapons';

import style from '../styles/app.scss';

function getDefaultOptions() {
  return {
    showSubCategories: true,
  };
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      options: getDefaultOptions(),
      warframes: props.data.warframes,
      weapons: props.data.weapons,
    };

    this.onChangeShowSubCategories = this.onChangeShowSubCategories.bind(this);
    this.onWarframeClick = this.onWarframeClick.bind(this);
  }

  onChangeShowSubCategories(event) {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        showSubCategories: event.target.checked,
      },
    })
  }

  onWarframeClick(name) {
    this.setState({
      ...this.state,
      warframes: {
        ...this.state.warframes,
        [name]: {
          ...this.state.warframes[name],
          mastered: !this.state.warframes[name].mastered,
        },
      },
    });
  }

  render() {
    return (
      <div className={style.app}>

        <Options
          options={this.state.options}
          onChangeShowSubCategories={this.onChangeShowSubCategories}
        />

        <div className={style.app__container}>

          <Warframes
            data={this.state.warframes}
            options={this.state.options}
            onClick={this.onWarframeClick}
          />

          <Weapons
            data={this.state.weapons}
            options={this.state.options}
          />

        </div>

      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.shape({
    warframes: PropTypes.any,
    weapons: PropTypes.any,
  }).isRequired,
};

export default App;
