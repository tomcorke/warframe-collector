import React from 'react';
import PropTypes from 'prop-types';

import style from '../styles/options.scss';

const Options = props => (
  <div className={style.options}>
    <input
      type="checkbox"
      onChange={props.onChangeShowSubCategories}
      checked={props.options.showSubCategories}
      value={props.options.showSubCategories}
    />
    Show Weapon Subcategories
  </div>
);

Options.propTypes = {
  options: PropTypes.shape({
    showSubCategories: PropTypes.boolean,
  }).isRequired,
  onChangeShowSubCategories: PropTypes.func.isRequired,
};

export default Options;
