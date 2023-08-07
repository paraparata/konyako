import styles from './FeedComposer.module.css';
import { Leaf } from 'phosphor-react';

interface FeedComposerProps {
  multiple?: boolean;
  disableSave?: boolean;
  onSave?: React.MouseEventHandler<HTMLButtonElement>;
}

export const FeedComposer: React.FC<FeedComposerProps> = ({
  multiple,
  disableSave,
  onSave,
}) => {
  return (
    <button
      className={styles['save-btn']}
      disabled={disableSave}
      onClick={onSave}
    >
      {multiple ? (
        <>
          Feed All{' '}
          <span style={{ position: 'relative' }}>
            <Leaf
              size={25}
              color='#9ece6a80'
              weight='duotone'
              style={{
                position: 'absolute',
                left: '5px',
                transform: 'rotate(25deg) translateY(5px)',
              }}
            />
            <Leaf size={25} color='#9ece6a' weight='duotone' />
          </span>
        </>
      ) : (
        <>
          Feed <Leaf size={25} color='#9ece6a' weight='duotone' />
        </>
      )}
    </button>
  );
};
