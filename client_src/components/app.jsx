import React from 'react';

import Warframes from './warframes';
import Weapons from './weapons';

const App = (props) => {
  const { warframes, weapons } = props.data;

  return (
    <div>
      <Warframes data={warframes} />
      <Weapons data={weapons} />
    </div>
  );
};

export default App;
