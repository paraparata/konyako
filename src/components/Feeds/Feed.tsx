import { FeedEditor } from './FeedEditor';
import { FeedView } from './FeedView';

import type { FeedType } from './feedsStore';
import type { FeedEditorProps } from './FeedEditor';

interface FeedProps extends Omit<FeedEditorProps, 'title' | 'content'> {
  mode: 'view' | 'editor';
  data: FeedType;
  disabled?: boolean;
  onViewClick?: () => void;
}

export const Feed: React.FC<FeedProps> = ({
  mode,
  data,
  disabled,
  onViewClick,
  ...FeedEditorProps
}) => {
  if (mode === 'view')
    return <FeedView data={data} disabled={disabled} onClick={onViewClick} />;

  if (mode === 'editor')
    return (
      <FeedEditor
        title={data.title ?? ''}
        content={data.content}
        {...FeedEditorProps}
      />
    );
  return <></>;
};
