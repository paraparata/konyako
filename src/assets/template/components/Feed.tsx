import { FeedType } from '../../../components/Feeds';
import { formatDate } from '../../../libs/helper';

export type TemplateFeedType = FeedType;

export interface TemplateFeedProps {
  data: TemplateFeedType;
  order?: 'top' | 'middle' | 'last' | 'none';
}

export const TemplateFeed: React.FC<TemplateFeedProps> = ({ data, order }) => (
  <article id={data.id} className='feed' data-order={order}>
    <section className='feed-data'>
      {data.parent && (
        <a href={`/feeds/${data.parent.id}`} role='prefetch'>
          <span className='parent' role='button'>
            on: {data.parent.title}
          </span>
        </a>
      )}
      {data.title && (
        <a href={`/feeds/${data.id}`} role='prefetch'>
          <h3>
            <b>[{data.title}]</b>
          </h3>
        </a>
      )}
      <p>{data.content}</p>
    </section>

    <section className='feed-meta'>
      <div className='tag-list'>{data.tags && <span>#ui</span>}</div>
      <time dateTime={data.created_at}>{formatDate(data.created_at)}</time>
    </section>
  </article>
);
