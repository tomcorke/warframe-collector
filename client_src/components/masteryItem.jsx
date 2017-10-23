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

const PROPERTY_OWNED = 'owned';
const PROPERTY_MASTERED = 'mastered';

const ITEM_PROPERTIES = [
  PROPERTY_OWNED,
  PROPERTY_MASTERED,
];

const ONCLICK_PROPERTY = PROPERTY_MASTERED;

class MasteryItem extends React.Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !this.props.item || ITEM_PROPERTIES.some(prop => nextProps.item[prop] != this.props.item[prop]);
  }

  onClick() {
    this.props.onChangeProperty(ONCLICK_PROPERTY, !this.props.item[ONCLICK_PROPERTY]);
  }

  render() {

    const { item, onChangeProperty } = this.props;

    const enabledItemProperties = ITEM_PROPERTIES.filter(prop => item[prop]);

    return (
      <div
        className={classnames(style.masteryItem, enabledItemProperties)}
        onClick={this.onClick}

        onKeyPress={this.onClick}
        role="button"
        tabIndex={0}
      >
        <div className={style.masteryItem__name}>{item.name}</div>

        <div className={style.masteryItem__propertyIndicators}>

          {ITEM_PROPERTIES.map(prop => {
            const currentValue = !!item[prop];
            return (
              <PropertyIndicator
                key={prop}
                name={prop}
                value={currentValue}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChangeProperty(prop, !currentValue);
                }}
              />
            );
          })}

        </div>

      </div>
    );

  }

}

MasteryItem.propTypes = {
  item: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

export default MasteryItem;
