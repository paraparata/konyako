import Modal from '@components/Modal';
import React, { Fragment, useEffect } from 'react';
import { Provider, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Editor } from './Editor';
import { FeedComposer, FeedView } from '@components/Feeds';
import { List } from '@components/List';
import { useConfigs } from '@libs/useConfigs';
import {
  activeIndexAtom,
  draftAtom,
  feedAtomFamily,
  initEditorAtom,
  isComposerSaveDisabledAtom,
  staticFeedsAtom,
} from '@libs/useEditorV2';
import type { FeedType } from '@libs/useFeeds';
import type { FeedViewProps } from '@components/Feeds/FeedView';

interface FeedViewAtomicProps extends Omit<FeedViewProps, 'data'> {
  feedId: FeedType['id'];
}

const FeedViewAtomic: React.FC<FeedViewAtomicProps> = ({
  feedId,
  ...props
}) => {
  const feed = useAtomValue(feedAtomFamily(feedId));
  return <FeedView data={feed} {...props} />;
};

interface EditFeedProps {
  feedIds?: FeedType['id'][];
  feeds?: Record<string, FeedType>;
}

const EditFeed: React.FC<EditFeedProps> = ({ feedIds, feeds }) => {
  const isEditing = useConfigs((state) => state.isEditing);
  const isComposerSaveDisabled = useAtomValue(isComposerSaveDisabledAtom);
  const draft = useAtomValue(draftAtom);
  const initEditor = useSetAtom(initEditorAtom);
  const staticFeeds = useSetAtom(staticFeedsAtom);

  const [activeIndex, setActiveIndex] = useAtom(activeIndexAtom);

  useEffect(() => {
    if (feedIds && feeds) {
      initEditor({ feedIds, feeds });
    }
  }, [feedIds, feeds]);

  const handleOnSave: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    const feeds = staticFeeds();
    console.log(draft, feeds);
    // useConfigs.setState(() => ({ isEditing: false }));
  };

  const handleOnCancel = async () => {
    // await cancelEditFeed();
    useConfigs.setState(() => ({ isEditing: false }));
  };

  return (
    <Modal
      open={isEditing}
      onCancel={handleOnCancel}
      okComponent={
        <FeedComposer
          multiple={draft.length > 1}
          disableSave={isComposerSaveDisabled}
          onSave={(e) => {
            console.log('ngana lipa');
            handleOnSave(e);
          }}
        />
      }
      MainProps={{
        style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
      }}
    >
      <List data={draft}>
        {(data) =>
          data.map((feedId, index) => {
            return (
              <Fragment key={feedId}>
                {activeIndex === index ? (
                  <Editor
                    feedId={feedId}
                    isFocusing={index !== 0 && index === activeIndex}
                    noTitle={index !== 0}
                  />
                ) : (
                  <FeedViewAtomic
                    feedId={feedId}
                    disabled={activeIndex !== index}
                    onClick={() => setActiveIndex(index)}
                  />
                )}
              </Fragment>
            );
          })
        }
      </List>
    </Modal>
  );
};

const EditFeedWrapper: React.FC<EditFeedProps> = (props) => (
  <Provider>
    <EditFeed {...props} />
  </Provider>
);

export default EditFeedWrapper;
