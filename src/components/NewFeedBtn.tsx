import { Leaf } from 'phosphor-react';
import { useConfigs } from '@libs/useConfigs';
import styles from './NewFeedBtn.module.css';
import { useEffect } from 'react';
import NewFeed from '@views/EditFeed/EditFeed';

const NewFeedBtn = () => {
  const isEditing = useConfigs((state) => state.isEditing);

  useEffect(() => {
    console.log(isEditing);
  }, [isEditing]);

  return (
    <>
      <button
        className={styles.root}
        onClick={() => useConfigs.setState(() => ({ isEditing: true }))}
      >
        <span>New Feed</span>
        <Leaf size={18} weight='duotone' style={{ color: 'var(--sc-green)' }} />
      </button>
      <NewFeed />
    </>
  );
};

export default NewFeedBtn;
