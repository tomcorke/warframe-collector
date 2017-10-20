import React from 'react';
import PropTypes from 'prop-types';
import MasteryItem from './mastery-item';
import Category from './category';
import Subcategory from './subcategory';
import './helpers';

const style = require('../styles/companions.scss');

const Companion = props => (
  <div className={style.companion}>
    <MasteryItem
      data={props.data}
      properties={['owned', 'mastered']}
      onClick={() => props.onChangeProperty('mastered', !props.data.mastered)}
      onChangeProperty={props.onChangeProperty}
    />
  </div>
);

Companion.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    mastered: PropTypes.bool,
  }).isRequired,
  onChangeProperty: PropTypes.func.isRequired,
};

const Companions = props => {
  const companions = Object.keys(props.data)
    .map(name => ({ ...props.data[name], name }))
    .filterByOptions(props.options);

  function createCompanionComponent(companion) {
    return (
      <Companion
        key={companion.name}
        data={companion}
        onChangeProperty={(prop, newValue) => props.onChangeProperty(companion, prop, newValue)}
      />
    );
  }

  if (props.options && props.options.showSubCategories) {
    const subcategories = companions.getUnique('subcategory').sort();

    return (
      <Category title="Companions">
        {subcategories.map(subcategory => {
          const itemsInSubcategory = companions.filter(item => item.subcategory === subcategory).sortByProp('name');

          return (
            <Subcategory key={subcategory} title={subcategory}>
              {itemsInSubcategory.map(createCompanionComponent)}
            </Subcategory>
          );
        })}
      </Category>
    );
  }

  return (
    <Category title="Companions">
      {companions.map(createCompanionComponent)}
    </Category>
  );
};

Companions.propTypes = {
  data: PropTypes.shape().isRequired,
  onChangeProperty: PropTypes.func.isRequired,
  options: PropTypes.shape({
    showOnlyUnmastered: PropTypes.bool,
  }).isRequired,
};

export default Companions;
