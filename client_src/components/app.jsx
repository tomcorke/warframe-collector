import React from 'react';
import PropTypes from 'prop-types';

import Options from './options';
import Warframes from './warframes';
import Weapons from './weapons';
import Companions from './companions';

import style from '../styles/app.scss';

function getDefaultOptions() {
  return {
    showSubCategories: true,
    showOnlyUnmastered: false,
    showOnlyOwned: false,
    showOnlyUnowned: false,
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: getDefaultOptions(),
      warframes: props.data.warframes,
      weapons: props.data.weapons,
      companions: props.data.companions,
    };

    this.onChangeOption = this.onChangeOption.bind(this);
    this.onWarframeChangeProperty = this.onWarframeChangeProperty.bind(this);
    this.onWeaponChangeProperty = this.onWeaponChangeProperty.bind(this);
    this.onCompanionChangeProperty = this.onCompanionChangeProperty.bind(this);
  }

  onChangeOption(name, newValue) {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        [name]: newValue,
      },
    });
  }

  onWarframeChangeProperty(warframe, propertyName, newValue) {
    this.setState({
      ...this.state,
      warframes: {
        ...this.state.warframes,
        [warframe.name]: {
          ...this.state.warframes[warframe.name],
          [propertyName]: newValue,
        },
      },
    });
  }

  onWeaponChangeProperty(weapon, propertyName, newValue) {
    this.setState({
      ...this.state,
      weapons: {
        ...this.state.weapons,
        [weapon.name]: {
          ...this.state.weapons[weapon.name],
          [propertyName]: newValue,
        },
      },
    });
  }

  onCompanionChangeProperty(companion, propertyName, newValue) {
    this.setState({
      ...this.state,
      companions: {
        ...this.state.companions,
        [companion.name]: {
          ...this.state.companions[companion.name],
          [propertyName]: newValue,
        },
      },
    });
  }

  render() {
    return (
      <div className={style.app}>

        <Options
          options={this.state.options}
          onChange={this.onChangeOption}
        />

        <div className={style.app__container}>

          <Warframes
            data={this.state.warframes}
            options={this.state.options}
            onChangeProperty={this.onWarframeChangeProperty}
          />

          <Weapons
            data={this.state.weapons}
            options={this.state.options}
            onChangeProperty={this.onWeaponChangeProperty}
          />

          <Companions
            data={this.state.companions}
            options={this.state.options}
            onChangeProperty={this.onCompanionChangeProperty}
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
