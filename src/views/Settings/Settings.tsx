import styles from './Settings.module.css';
import { useState } from 'react';
import { FloppyDisk } from 'phosphor-react';
import { ConfigsType, useConfigs } from '@libs/useConfigs';

const Settings = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const repoUrl = useConfigs((state) => state.repoUrl);
  const feedsPath = useConfigs((state) => state.feedsPath);

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    form.forEach((val, key) => {
      console.log(key, val);
    });
  };

  const handleOnChange: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    for (const [key, val] of form.entries()) {
      if (useConfigs.getState()[key as keyof ConfigsType] !== val) {
        setIsDisabled(false);
        break;
      } else {
        setIsDisabled(true);
      }
    }
  };

  return (
    <>
      <form
        className={styles.root}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
      >
        <div className={styles.form}>
          <label htmlFor='projectPath'>Repo Url</label>
          <input
            name='repoUrl'
            defaultValue={repoUrl}
            placeholder='https://github.com/ngape/repo'
          />

          <label htmlFor='feedsPath'>Feeds Path</label>
          <input
            name='feedsPath'
            defaultValue={feedsPath}
            placeholder='/feeds-path'
          />

          {/* <label htmlFor='afterCommand'>
            After Command{' '}
            <span
              title='Run command after clicking Feed button and generating markdown.'
              role='tooltip'
            >
              ?
            </span>
          </label>
          <textarea
            id='afterCommand'
            name='After Command'
            value={configs.afterCommand}
            placeholder='$ git add . && git commit -m "new feed"'
            rows={8}
            onChange={handleOnChange}
          /> */}
        </div>

        <div className={styles.actions}>
          <button
            type='submit'
            disabled={isDisabled}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}
          >
            Save <FloppyDisk size={25} color='#9ece6a' weight='duotone' />
          </button>
        </div>
      </form>
    </>
  );
};

export default Settings;
