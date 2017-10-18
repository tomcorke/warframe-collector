import React from 'react';

import Warframes from './warframes';
import Weapons from './weapons';

import style from '../styles/app';

const App = (props) => {
  const { warframes, weapons } = props.data;

  return (
    <div className={style.app}>
      <Warframes data={warframes} />
      <Weapons data={weapons} />
    </div>
  );
};

export default App;
