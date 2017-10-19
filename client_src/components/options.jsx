import React from 'react';
import PropTypes from 'prop-types';

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
        checked={props.options[props.name]}
        value={props.options[props.name]}
      />
      {props.children}
    </label>
  </Option>
);

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

const Options = props => (
  <div className={style.options}>

    <Checkbox
      name="showSubCategories"
      options={props.options}
      onChange={props.onChange}
    >
      Show subcategories
    </Checkbox>

    <Checkbox
      name="showOnlyOwned"
      options={props.options}
      onChange={props.onChange}
    >
      Show only owned
    </Checkbox>

    <Checkbox
      name="showOnlyUnowned"
      options={props.options}
      onChange={props.onChange}
    >
      Show only unowned
    </Checkbox>

    <Checkbox
      name="showOnlyUnmastered"
      options={props.options}
      onChange={props.onChange}
    >
      Show only unmastered
    </Checkbox>

  </div>
);

Options.propTypes = {
  options: PropTypes.shape({
    showSubCategories: PropTypes.boolean,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Options;
