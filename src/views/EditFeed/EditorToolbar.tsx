import styles from './EditorToolbar.module.css';
import { ImageSquare, PlusCircle, Trash } from 'phosphor-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { nanoid } from 'nanoid';
import {
  activeIndexAtom,
  addFeedAtom,
  contentIsEmptyAtom,
  deleteFeedAtom,
} from '@libs/useEditorV2';
import type { FeedType } from '@libs/useFeeds';

export interface FeedToolbarProps {
  feedId: FeedType['id'];
}

export const EditorToolbar: React.FC<FeedToolbarProps> = ({ feedId }) => {
  const activeIndex = useAtomValue(activeIndexAtom);
  const disableAdd = useAtomValue(contentIsEmptyAtom);
  const addNewFeed = useSetAtom(addFeedAtom);
  const deleteFeed = useSetAtom(deleteFeedAtom);

  const handleOnAddFeed = () => {
    if (!disableAdd) addNewFeed(nanoid());
  };

  const handleOnDelete = () => {
    if (activeIndex !== 0) deleteFeed(feedId);
  };

  return (
    <div className={styles.root}>
      <button data-kind='icon'>
        <ImageSquare size={25} color='#bb9af7' weight='duotone' />
      </button>
      <button data-kind='icon' disabled={disableAdd} onClick={handleOnAddFeed}>
        <PlusCircle size={25} color='#bb9af7' weight='duotone' />
      </button>
      <button
        data-kind='icon'
        disabled={activeIndex === 0}
        onClick={handleOnDelete}
      >
        <Trash size={25} color='#f7768e' weight='duotone' />
      </button>
    </div>
  );
};
