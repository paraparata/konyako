import { FeedView } from '@components/Feeds';
import { useFeeds } from '@libs/useFeeds';
import { List } from '@components/List';
import { useLocation } from 'wouter';

const Timeline = () => {
  const feeds = useFeeds((state) => state.feeds);
  const [, setUrl] = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <List data={feeds}>
        {(data) =>
          data.map((feed) => {
            const slug = feed.parent?.id
              ? `${feed.parent.id}#${feed.id}`
              : `${feed.id}`;

            return (
              <FeedView
                key={feed.id}
                data={feed}
                onClick={() => setUrl(`/feeds/${slug}`)}
              />
            );
          })
        }
      </List>
    </div>
  );
};

export default Timeline;
