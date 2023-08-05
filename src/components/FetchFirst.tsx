import { useEffect, useState } from 'react';
import { init } from '@libs/useFeeds';

import styles from './FetchFirst.module.css';
import { useConfigs } from '@libs/useConfigs';

const FetchFirst = () => {
  const [feedsPath, setBaseUrl] = useState(useConfigs.getState().feedsPath);

  useEffect(() => {
    if (feedsPath) init(feedsPath);
  }, [feedsPath]);

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const feedsPathVal = form.get('feedsPath');

    if (feedsPathVal) setBaseUrl(feedsPathVal as string);
  };

  return (
    <div className={styles.root}>
      <div>
        <h1 data-konyako='true'>konyako</h1>
        <h2>man, I love Twitt'r</h2>
      </div>

      <form onSubmit={handleOnSubmit}>
        <p>Fetch your repo first</p>
        <div className={styles.repo}>
          <input
            type='text'
            name='repoUrl'
            placeholder='https://github.com/ngape/repo'
            autoFocus
          />
          <input type='text' name='feedsPath' placeholder='/feeds-path' />
          <button type='submit'>Fetch</button>
        </div>
      </form>

      <span className={styles.help}>artinya apa bang mesi?</span>
    </div>
  );
};

export default FetchFirst;
