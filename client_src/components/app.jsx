import React from 'react';
import PropTypes from 'prop-types';
import storeEngine from 'store/src/store-engine';
import localStorage from 'store/storages/localStorage';
import api from './api';
import { ITEM_KEY_SELECTOR, ITEM_SAVEDATA_PROPS } from './helpers';

import Options from './options';
import ItemGroup from './itemGroup';

import style from '../styles/app.scss';

const store = storeEngine.createStore([ localStorage ], []);
const saveToStore = (data) => store.set('wfc_data', data);
const loadFromStore = () => store.get('wfc_data') || {};

const OPTIONS = {
  showSubCategories: {
    type: 'checkbox',
    default: true,
    label: 'Show subcategories',
    order: 1,
  },
  showOnlyUnmastered: {
    type: 'checkbox',
    default: false,
    label: 'Show only unmastered',
    order: 2,
  },
  showOnlyOwned: {
    type: 'checkbox',
    default: false,
    label: 'Show only owned',
    order: 3,
  },
  showOnlyUnowned: {
    type: 'checkbox',
    default: false,
    label: 'Show only unowned',
    order: 4,
  },
  save: {
    type: 'button',
    label: 'Save',
    order: 5,
    action: function save() {
      saveToStore(this.getSaveData());
    },
  },
  load: {
    type: 'button',
    label: 'Load',
    order: 6,
    action: function load() {
      this.setState(this.loadToState(loadFromStore()));
    },
  },
  reset: {
    type: 'button',
    label: 'Reset',
    order: 7,
    action: function reset() {
      this.setState(this.loadToState({}));
    },
  },
};

function getDefaultOptions() {
  return Object.keys(OPTIONS).reduce((options, option) => {
    return {
      ...options,
      [option]: OPTIONS[option].default,
    };
  }, {});
}

const DATA_ITEM_MAP = {
  Warframes: 'warframes',
  Weapons: 'weapons',
  Archwings: 'archwings',
  Companions: 'companions',
};

function mapDataItemKeys(data, itemTopLevelCategory) {
  const itemNames = Object.keys(data[itemTopLevelCategory]);
  return itemNames.reduce((items, name) => {
    const item = data[itemTopLevelCategory][name];
    return {
      ...items,
      [name]: {
        ...item,
        key: [itemTopLevelCategory, name].join('_').replace(' ', '-'),
      },
    };
  }, {});
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: getDefaultOptions(),
    };

    Object.keys(DATA_ITEM_MAP)
      .forEach(itemTypeName => {
        this.state[itemTypeName] = mapDataItemKeys(props.data, DATA_ITEM_MAP[itemTypeName]);
      });

    this.state = this.loadToState(loadFromStore());

    this.onChangeOption = this.onChangeOption.bind(this);
    this.onClickOption = this.onClickOption.bind(this);
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

  onClickOption(name) {
    const { action } = OPTIONS[name];
    if (action) {
      action.call(this);
    }
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

  getSaveData() {
    return Object.keys(DATA_ITEM_MAP)
      .reduce((saveData, itemType) => {
        const items = this.state[itemType];
        const itemNames = Object.keys(items);
        return {
          ...saveData,
          ...itemNames.reduce((saveItems, name) => {
            const item = items[name];
            if (ITEM_SAVEDATA_PROPS.some(prop => item[prop])) {
              const saveItem = {};
              ITEM_SAVEDATA_PROPS.forEach(prop => {
                if (item[prop]) { saveItem[prop] = item[prop]; }
              });
              return {
                ...saveItems,
                [ITEM_KEY_SELECTOR(item)]: saveItem,
              };
            }
            return saveItems;
          }, {}),
        };
      }, {});
  }

  loadToState(data = {}) {
    const itemTypeNames = Object.keys(DATA_ITEM_MAP);
    return {
      ...this.state,
      ...itemTypeNames.reduce((itemTypes, itemType) => {
        const itemNames = Object.keys(this.state[itemType]);
        return {
          ...itemTypes,
          [itemType]: itemNames.reduce((items, itemName) => {
            const item = this.state[itemType][itemName];
            const savedItem = data[item.key];
            return {
              ...items,
              [itemName]: {
                ...item,
                ...ITEM_SAVEDATA_PROPS.reduce((props, prop) => {
                  return {
                    ...props,
                    [prop]: false,
                  };
                }, {}),
                ...savedItem,
              },
            };
          }, {}),
        };
      }, {}),
    };
  }

  render() {
    return (
      <div className={style.app}>

        <Options
          values={this.state.options}
          config={OPTIONS}
          onChange={this.onChangeOption}
          onClick={this.onClickOption}
        />

        <div className={style.app__container}>

          {
            Object.keys(DATA_ITEM_MAP)
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
