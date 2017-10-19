import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from '../styles/masteryItem.scss';

const PropertyIndicator = props => (
  <div
    className={classnames(style.masteryItem__propertyIndicator, { on: props.value }, props.name)}
    onClick={props.onClick}
    onKeyPress={props.onClick}
    role="button"
    tabIndex={0}
    title={props.name}
  />
);

PropertyIndicator.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const MasteryItem = props => (
  <div
    className={classnames(style.masteryItem, props.properties.reduce((ap, p) => ({ ...ap, [p]: props.data[p] }), {}))}
    onClick={props.onClick}
    onKeyPress={props.onClick}
    role="button"
    tabIndex={0}
  >
    <div className={style.masteryItem__name}>{props.data.name}</div>
    <div className={style.masteryItem__propertyIndicators}>
      {props.properties && props.properties.map(prop => {
        const currentValue = !!props.data[prop];
        return (
          <PropertyIndicator
            key={prop}
            name={prop}
            value={currentValue}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onChangeProperty(prop, !currentValue);
            }}
          />
        );
      })}
    </div>
  </div>
);

MasteryItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  onChangeProperty: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  properties: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MasteryItem.defaultProps = {
  mastered: false,
};

export default MasteryItem;