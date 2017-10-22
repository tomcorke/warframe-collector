import React from 'react';
import PropTypes from 'prop-types';
import './helpers';

import style from '../styles/options.scss';

const Option = props => (
  <div className={style.option}>
    {props.children}
  </div>
);

Option.propTypes = {
  children: PropTypes.node.isRequired,
};

const Checkbox = props => (
  <Option>
    <label>
      <input
        type="checkbox"
        onChange={e => props.onChange(props.name, e.target.checked)}
        checked={props.value}
        value={props.value}
      />
      {props.children}
    </label>
  </Option>
);

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

class Options extends React.Component {

  constructor(props) {
    super(props);

    this.createComponentForOption = this.createComponentForOption.bind(this);
    this.createCheckboxForOption = this.createCheckboxForOption.bind(this);
    this.createButtonForOption = this.createButtonForOption.bind(this);

    this.optionTypeComponentCreators = {
      checkbox: this.createCheckboxForOption,
      button: this.createButtonForOption,
    };
  }

  createComponentForOption(option) {
    const optionType = this.props.config[option].type;
    return this.optionTypeComponentCreators[optionType]
      ? this.optionTypeComponentCreators[optionType](option)
      : null;
  }

  createCheckboxForOption(option) {
    const optionConfig = this.props.config[option];
    const optionValue = this.props.values[option];
    return (
      <Checkbox
        key={option}
        name={option}
        onChange={this.props.onChange}
        value={optionValue}
      >
        {optionConfig.label}
      </Checkbox>
    );
  }

  createButtonForOption(option) {
    const optionConfig = this.props.config[option];
    return (
      <button
        key={option}
        onClick={() => this.props.onClick(option)}
      >
        {optionConfig.label}
      </button>
    );
  }

  render() {

    const optionNames = Object.keys(this.props.config)
      .sortBy(option => this.props.config[option].order);

    return (
      <div className={style.options}>
        {optionNames
          .map(option => this.createComponentForOption(option))}
      </div>
    );
  }
}

export default Options;
