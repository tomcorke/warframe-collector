import React from 'react';

import styles from '../styles/masteryItem.scss';

const MasteryItem = props => (
  <div className={styles.masteryItem}>
    {props.name}
  </div>
);

export default MasteryItem;