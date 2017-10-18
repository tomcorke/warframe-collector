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
    super();
    this.props = props;

    this.state = {
      options: getDefaultOptions(),
    };

    this.onChangeShowSubCategories = this.onChangeShowSubCategories.bind(this);
  }

  onChangeShowSubCategories(event) {
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        showSubCategories: event.target.checked,
      }
    })
  }

  render() {
    const { warframes, weapons } = this.props.data;

    return (
      <div className={style.app}>

        <Options
          options={this.state.options}
          onChangeShowSubCategories={this.onChangeShowSubCategories}
        />

        <div className={style.app__container}>
          <Warframes data={warframes} options={this.state.options} />
          <Weapons data={weapons} options={this.state.options} />
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
