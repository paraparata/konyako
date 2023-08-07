import { useEffect, useMemo, useRef } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  contentCounterAtom,
  editFeedAtom,
  feedAtomFamily,
} from '@libs/useEditorV2';

import styles from './Editor.module.css';
import type { FeedType } from '@libs/useFeeds';
import type { EditableFeedType } from '@libs/useEditor';

const MAX_CHAR = 300;

export interface EditorProps {
  feedId: FeedType['id'];
  noTitle?: boolean;
  isFocusing?: boolean;
}

const Counter = ({ feedId }: { feedId: FeedType['id'] }) => {
  const counter = useAtomValue(
    useMemo(() => contentCounterAtom(feedId), [feedId])
  );

  const colorStyle =
    MAX_CHAR - counter > 5 && MAX_CHAR - counter < 15
      ? 'var(--sc-orange)'
      : MAX_CHAR - counter >= 0 && MAX_CHAR - counter <= 5
      ? '#e0e068'
      : MAX_CHAR - counter < 0
      ? 'red'
      : 'var(--sc-postpurp)';

  return <span style={{ color: colorStyle }}>{MAX_CHAR - counter}</span>;
};

export const Editor: React.FC<EditorProps> = ({
  feedId,
  noTitle,
  isFocusing,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const feed = useAtomValue(feedAtomFamily(feedId));
  const editFeed = useSetAtom(editFeedAtom);

  useEffect(() => {
    if (editorRef.current && isFocusing) {
      editorRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [isFocusing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    editFeed([
      feedId,
      { [e.target.name as keyof EditableFeedType]: e.target.value },
    ]);
  };

  return (
    <div ref={editorRef} className={styles.root} data-focus={isFocusing}>
      {!noTitle && (
        <div className={styles.title}>
          <input
            name='title'
            value={feed.title ?? ''}
            placeholder='Title (optional)'
            onChange={handleChange}
          />
        </div>
      )}

      <div className={styles['content-wrapper']}>
        <EditorToolbar feedId={feedId} />
        <div className={styles.content}>
          <textarea
            name='content'
            value={feed.content}
            placeholder="What's right?"
            rows={5}
            autoFocus
            onChange={handleChange}
          />
          <Counter feedId={feedId} />
        </div>
      </div>
    </div>
  );
};
