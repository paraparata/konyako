import { Leaf } from 'phosphor-react';
import { useConfigs } from '@libs/useConfigs';
import styles from './NewFeedBtn.module.css';
import EditFeed from '@views/EditFeed/EditFeed';

const NewFeedBtn = () => {
  return (
    <>
      <button
        className={styles.root}
        onClick={() => useConfigs.setState(() => ({ isEditing: true }))}
      >
        <span>New Feed</span>
        <Leaf size={18} weight='duotone' style={{ color: 'var(--sc-green)' }} />
      </button>
      <EditFeed />
    </>
  );
};

export default NewFeedBtn;
