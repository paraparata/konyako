import styles from './Feeds.module.css';

import { Feed } from './Feed';
import { FeedsProvider, useFeedsStore } from './feedsStore';
import { FeedComposer } from './FeedComposer';

import type { FeedStoreState, FeedType } from './feedsStore';
import type { FeedEditorProps } from './FeedEditor';
import { editFeed, setActiveIndex, useFeeds } from '@libs/useFeeds';

interface FeedsComponentProps {
  onSave: (feeds: FeedType[]) => Promise<void>;
}

interface FeedsProps extends FeedsComponentProps {
  initState?: Partial<FeedStoreState>;
}

const FeedsComponent: React.FC<FeedsComponentProps> = ({ onSave }) => {
  const feeds = useFeeds((state) => state.feeds);
  const activeIndex = useFeeds((state) => state.activeIndex);

  const handleChange =
    (index: number): FeedEditorProps['onChange'] =>
    (key, val) => {
      editFeed(index, key, val);
    };

  return (
    <div className={styles.root}>
      <FeedComposer
        multiple={feeds.length > 1}
        disableSave={feeds.some((feed) => feed.content === '')}
        onSave={() => onSave(feeds)}
      />

      {feeds.map((feed, index) => (
        <Feed
          key={feed.id}
          mode={activeIndex === index ? 'editor' : 'view'}
          noTitle={index !== 0}
          data={feed}
          isFocusing={index !== 0 && index === activeIndex}
          disabled={activeIndex !== index}
          onChange={handleChange(index)}
          onViewClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
};

const Feeds: React.FC<FeedsProps> = ({ initState, onSave }) => (
  <FeedsProvider initState={initState}>
    <FeedsComponent onSave={onSave} />
  </FeedsProvider>
);

export default Feeds;
