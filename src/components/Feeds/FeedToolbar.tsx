import { ImageSquare, PlusCircle, Trash } from 'phosphor-react';
// import { addNewFeed, deleteFeed, useFeeds } from '@libs/useFeeds';
import styles from './FeedToolbar.module.css';

export interface FeedToolbarProps {
  disableAdd?: boolean;
  disableDelete?: boolean;
  onAddNew: () => void;
  onDelete: () => void;
}

export const FeedToolbar: React.FC<FeedToolbarProps> = ({
  disableAdd,
  disableDelete,
  onAddNew,
  onDelete,
}) => {
  // const [feeds, activeIndex] = useFeeds((state) => [
  //   state.feeds,
  //   state.activeIndex,
  // ]);

  // const handleOnAddFeed = () => {
  //   if (feeds[activeIndex].content) addNewFeed();
  // };

  // const handleOnDelete = () => {
  //   if (activeIndex !== 0) deleteFeed();
  // };

  return (
    <div className={styles.root}>
      <button data-kind='icon'>
        <ImageSquare size={25} color='#bb9af7' weight='duotone' />
      </button>
      <button
        data-kind='icon'
        disabled={disableAdd}
        onClick={onAddNew}
      >
        <PlusCircle size={25} color='#bb9af7' weight='duotone' />
      </button>
      <button
        data-kind='icon'
        disabled={disableDelete}
        onClick={onDelete}
      >
        <Trash size={25} color='#f7768e' weight='duotone' />
      </button>
    </div>
  );
};
