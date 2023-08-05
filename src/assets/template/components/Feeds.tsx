import { TemplateFeed } from './Feed';
import type { TemplateFeedType } from './Feed';

export interface FeedReactProps {
  feeds: TemplateFeedType[];
}

export const TemplateFeeds: React.FC<FeedReactProps> = ({ feeds }) => {
  if (feeds.length === 0)
    return (
      <p style={{ marginTop: '3rem', color: 'coral', textAlign: 'center' }}>
        x_x
        <br />
        <br />
        No data..
      </p>
    );

  return (
    <>
      {feeds.map((feed) => (
        <TemplateFeed key={feed.id} data={feed} />
      ))}
    </>
  );
};
