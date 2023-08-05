// import { checkUpdate } from '@libs/useFeeds';
import { ArrowsClockwise } from 'phosphor-react';
import { useState } from 'react';

import styles from './CheckUpdate.module.css';
import { crud } from '@libs/konyadb';

const CheckUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnCheck = async () => {
    const dummy = {
      id1: {
        name: 'ngana',
        age: 2,
      },
      id2: {
        name: 'p',
        age: 3,
      },
    };

    const [newDummy, err] = crud.delete(dummy, 'id1');

    console.log(dummy, newDummy);

    setIsLoading(true);
    // await checkUpdate();
    // console.log('yoi');
    setIsLoading(false);
  };

  return (
    <button
      className={styles.root}
      data-kind='icon'
      disabled={isLoading}
      onClick={handleOnCheck}
    >
      <ArrowsClockwise
        size={18}
        weight={isLoading ? 'bold' : 'regular'}
        style={{ color: isLoading ? 'var(--sc-yellow)' : 'inherit' }}
      />
    </button>
  );
};

export default CheckUpdate;
