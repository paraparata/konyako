import { FeedView } from '@components/Feeds';
import { List } from '@components/List';
import { useFeeds } from '@libs/useFeeds';
import { useLocation } from 'wouter';

const Topics = () => {
  const topics = useFeeds((state) => state.topics);
  const [_, setUrl] = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <List data={topics}>
        {(data) =>
          data.map((topic) => {
            const slug = topic.parent?.id
              ? `${topic.parent.id}#${topic.id}`
              : `${topic.id}`;

            return (
              <FeedView
                key={topic.id}
                data={topic}
                onClick={() => setUrl(`/feeds/${slug}`)}
              />
            );
          })
        }
      </List>
    </div>
  );
};

export default Topics;
