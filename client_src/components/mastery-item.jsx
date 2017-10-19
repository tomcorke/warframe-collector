import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from '../styles/masteryItem.scss';

const MasteryItem = props => (
  <div className={style.masteryItem} onClick={props.onClick} onKeyPress={props.onClick} role="button" tabIndex={0}>
    <div className={style.masteryItem__name}>{props.name}</div>
    <div className={classnames(style.masteryItem__masteryIcon, { mastered: props.mastered })} />
  </div>
);

MasteryItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  mastered: PropTypes.bool,
};

MasteryItem.defaultProps = {
  mastered: false,
};

export default MasteryItem;