// import { savedConfigs } from '@libs/api';
// import { formatPath } from '@libs/helper';
import { NavLink } from '@components/Link';
import { Feed, FeedComposer } from '@components/Feeds';
import { ModalHeader, ModalLayout, ModalMain } from '@components/Layout';
import { FeedsProvider, useFeedsStore } from '@components/Feeds/feedsStore';
// import { useLocation } from 'wouter';

const NewFeed = () => {
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
          <NavLink href='/'>
            <button>Cancel</button>
          </NavLink>
          <FeedComposer
            multiple={feeds.length > 1}
            disableSave={feeds.some((feed) => feed.content === '')}
            onSave={handleOnSave}
          />
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

const NewFeedWrapper = () => {
  return (
    <FeedsProvider>
      <NewFeed />
    </FeedsProvider>
  );
};

export default NewFeedWrapper;
