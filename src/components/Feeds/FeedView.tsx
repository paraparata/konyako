import styles from './FeedView.module.css';
import { forwardRef } from 'react';
import { formatDate } from '@libs/helper';
import { NavLink } from '@components/Link';

import type { FeedType } from './feedsStore';

export interface FeedViewProps {
  data: FeedType;
  disabled?: boolean;
  onClick?: () => void;
}

export const FeedView = forwardRef<HTMLElement, FeedViewProps>(
  ({ data, disabled, onClick }, ref) => (
    <article
      ref={ref}
      id={data.id}
      className={styles.root}
      aria-disabled={disabled}
      onClick={onClick}
    >
      <section>
        {data.parent && (
          <NavLink
            href={`/feeds/${data.parent.id}`}
            style={{ textDecoration: 'none' }}
          >
            <span data-type='parent'>on: {data.parent.title}</span>
          </NavLink>
        )}
        {data.title && (
          <span data-type='title'>
            <b>[{data.title}]</b>
          </span>
        )}
        <p data-type='content'>{data.content}</p>
      </section>

      <section>
        <div data-type='tags'>
          {data.tags && <span data-type='tag'>#ui</span>}
        </div>
        <time
          dateTime={(() => {
            const date = new Date(data.created_at);
            return `${date.getHours()}:${date.getMinutes()}`;
          })()}
        >
          {formatDate(data.created_at)}
        </time>
      </section>
    </article>
  )
);
