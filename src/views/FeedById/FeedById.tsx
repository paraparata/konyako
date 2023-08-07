import { FeedView } from '@components/Feeds';
import { useEffect, useRef, useState } from 'react';

import { FeedType } from '@libs/useFeeds';
import styles from './FeedById.module.css';
import { useConfigs } from '@libs/useConfigs';
import EditFeed from '@views/EditFeed/EditFeed';

interface FeedByIdProps {
  id: string;
}

const FeedViewWrapper = ({ data }: { data: FeedType }) => {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elRef.current && (!data.parent || location.hash.slice(1) === data.id)) {
      elRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elRef.current.style.fontSize = '20px';
    }
  }, [data]);

  return <FeedView ref={elRef} data={data} />;
};

const FeedById: React.FC<FeedByIdProps> = ({ id }) => {
  const [feeds, setFeeds] = useState<FeedType[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/snapshot.json');
      const data = await res.json();
      console.log(data);
      if (data)
        setFeeds(
          (data as FeedType[]).filter((feed) =>
            feed.parent ? feed.parent.id === id : feed.id === id
          )
        );
    };

    fetcher();
  }, [id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {feeds.map((feed, index) => (
        <FeedViewWrapper key={index} data={feed} />
      ))}

      <button
        className={styles['add-feed-btn']}
        onClick={() => useConfigs.setState(() => ({ isEditing: true }))}
      >
        + Add feed
      </button>
      <EditFeed />
    </div>
  );
};

export default FeedById;
