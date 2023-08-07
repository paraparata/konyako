import { useEffect, useRef, useState } from 'react';
import { FeedToolbar } from './FeedToolbar';

import styles from './FeedEditor.module.css';
import type { FeedToolbarProps } from './FeedToolbar';
import type { FeedType } from '@libs/useFeeds';
import type { EditableFeedType } from '@libs/useEditor';

const MAX_CHAR = 300;

export interface FeedEditorProps extends FeedToolbarProps {
  noTitle?: boolean;
  isFocusing?: boolean;
  title?: string;
  content: string;
  onChange?: <T extends keyof EditableFeedType>(
    key: T,
    value: FeedType[T]
  ) => void;
}

export const FeedEditor: React.FC<FeedEditorProps> = ({
  noTitle,
  isFocusing,
  title,
  content,
  onChange,
  ...toolbarProps
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [counter, setCounter] = useState(content.length ?? 0);

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
    if (onChange) {
      onChange(e.target.name as keyof EditableFeedType, e.target.value);
      if (e.target.name === 'content') setCounter(e.target.value.length);
    }
  };

  const colorStyle =
    MAX_CHAR - counter > 5 && MAX_CHAR - counter < 15
      ? 'var(--sc-orange)'
      : MAX_CHAR - counter >= 0 && MAX_CHAR - counter <= 5
      ? '#e0e068'
      : MAX_CHAR - counter < 0
      ? 'red'
      : 'var(--sc-postpurp)';

  return (
    <div ref={editorRef} className={styles.root} data-focus={isFocusing}>
      {!noTitle && (
        <div className={styles.title}>
          <input
            name='title'
            value={title}
            placeholder='Title (optional)'
            onChange={handleChange}
          />
        </div>
      )}

      <div className={styles['content-wrapper']}>
        <FeedToolbar {...toolbarProps} />
        <div className={styles.content}>
          <textarea
            name='content'
            value={content}
            placeholder="What's right?"
            rows={5}
            autoFocus
            onChange={handleChange}
          />
          <span style={{ color: colorStyle }}>{MAX_CHAR - counter}</span>
        </div>
      </div>
    </div>
  );
};
