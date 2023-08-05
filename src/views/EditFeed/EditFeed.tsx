import Modal from '@components/Modal';
import { Feed, FeedComposer } from '@components/Feeds';
import { List } from '@components/List';
import { useConfigs } from '@libs/useConfigs';
import {
  addNewFeed,
  deleteFeed,
  editFeed,
  setActiveIndex,
  useEditor,
} from '@libs/useEditor';

const NewFeed = () => {
  const [draft, activeIndex] = useEditor((state) => [
    state.draft,
    state.activeIndex,
  ]);

  const isEditing = useConfigs((state) => state.isEditing);

  const handleOnAddFeed = () => {
    if (draft[activeIndex].content) addNewFeed();
  };

  const handleOnDelete = () => {
    if (activeIndex !== 0) deleteFeed();
  };

  const handleOnSave = async () => {
    console.log('saved');
    useConfigs.setState(() => ({ isEditing: false }));
  };

  const handleOnCancel = async () => {
    // await cancelEditFeed();
    useConfigs.setState(() => ({ isEditing: false }));
  };

  return (
    <Modal
      open={isEditing}
      onCancel={handleOnCancel}
      onOk={handleOnSave}
      okComponent={
        <FeedComposer
          multiple={draft.length > 1}
          disableSave={draft.some((feed) => feed.content === '')}
          onSave={handleOnSave}
        />
      }
      MainProps={{
        style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
      }}
    >
      <List data={draft}>
        {(data) =>
          data.map((feed, index) => (
            <Feed
              key={index}
              mode={activeIndex === index ? 'editor' : 'view'}
              data={feed}
              isFocusing={index !== 0 && index === activeIndex}
              disabled={activeIndex !== index}
              onChange={(key, val) => editFeed(index, key, val)}
              onViewClick={() => setActiveIndex(index)}
              disableAdd={!draft[activeIndex].content}
              disableDelete={activeIndex === 0}
              onAddNew={handleOnAddFeed}
              onDelete={handleOnDelete}
            />
          ))
        }
      </List>
    </Modal>
  );
};

export default NewFeed;
