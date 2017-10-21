import React from 'react';
import PropTypes from 'prop-types';

import Options from './options';
import ItemGroup from './itemGroup';

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
      Warframes: props.data.warframes,
      Weapons: props.data.weapons,
      Archwings: props.data.archwings,
      Companions: props.data.companions,
    };

    this.onChangeOption = this.onChangeOption.bind(this);
    this.onChangeItemProperty = this.onChangeItemProperty.bind(this);
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

  onChangeItemProperty(itemType, item, propertyName, newValue) {
    this.setState({
      ...this.state,
      [itemType]: {
        ...this.state[itemType],
        [item.name]: {
          ...this.state[itemType][item.name],
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

          {
            ['Warframes', 'Weapons', 'Archwings', 'Companions']
              .map(itemType => (
                <ItemGroup
                  key={itemType}
                  itemCategory={itemType}
                  items={this.state[itemType]}
                  options={this.state.options}
                  onChangeProperty={(...args) => this.onChangeItemProperty(itemType, ...args)}
                />
              ))
            }

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
