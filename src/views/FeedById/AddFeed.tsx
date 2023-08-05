// import { savedConfigs } from '@libs/api';
// import { formatPath } from '@libs/helper';
import { Feed } from '@components/Feeds';
import { ModalHeader, ModalLayout, ModalMain } from '@components/Layout';
import {
  FeedType,
  FeedsProvider,
  useFeedsStore,
} from '@components/Feeds/feedsStore';
import { createPortal } from 'react-dom';
// import { useLocation } from 'wouter';
import styles from './AddFeed.module.css';

const AddFeed: React.FC<Pick<AddFeedWrapperProps, 'toggleOpen'>> = ({
  toggleOpen,
}) => {
  const feeds = useFeedsStore((state) => state.feeds);
  const activeIndex = useFeedsStore((state) => state.activeIndex);
  // const [, setRoute] = useLocation();

  const { setFeed } = useFeedsStore((state) => state.action);

  const handleOnSave = async () => {
    console.log('saved');
    // const homeDirPath = await homeDir();
    // const feedsPath =
    //   homeDirPath + formatPath(savedConfigs().feedsPath) + '/snapshot.json';

    // await invoke('generate_snapshot', {
    //   feeds: JSON.stringify(feeds),
    //   path: feedsPath,
    // });
    // setRoute('/');
    toggleOpen();
  };

  return (
    <ModalLayout>
      <ModalHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button onClick={() => toggleOpen()}>Cancel</button>
          <button
            disabled={feeds.some((feed) => feed.content === '')}
            onClick={handleOnSave}
          >
            Add Feed
          </button>
        </div>
      </ModalHeader>

      <ModalMain
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {feeds.map((feed, index) => (
          <Feed
            key={index}
            mode={activeIndex === index ? 'editor' : 'view'}
            data={feed}
            isFocusing={index !== 0 && index === activeIndex}
            disabled={activeIndex !== index}
            onChange={(key, val) => setFeed(index, key, val)}
          />
        ))}
      </ModalMain>
    </ModalLayout>
  );
};

interface AddFeedWrapperProps {
  initData: FeedType[];
  open: boolean;
  toggleOpen: () => void;
}

const AddFeedWrapper: React.FC<AddFeedWrapperProps> = ({
  initData,
  open,
  toggleOpen,
}) => {
  if (open)
    return createPortal(
      <FeedsProvider initState={{ feeds: initData }}>
        <AddFeed toggleOpen={toggleOpen} />
      </FeedsProvider>,
      document.body
    );

  return (
    <button className={styles['add-feed-btn']} onClick={toggleOpen}>
      + Add feed
    </button>
  );
};

export default AddFeedWrapper;
