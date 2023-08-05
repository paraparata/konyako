import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  okLabel?: string;
  okComponent?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  MainProps?: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  okLabel,
  okComponent,
  onOk,
  onCancel,
  className,
  MainProps,
  children,
  ...props
}) => {
  return createPortal(
    <dialog className={`${styles.root} ${className}`} {...props}>
      <header className={styles.header}>
        <form>
          <button formMethod='dialog' onClick={onCancel}>
            Cancel
          </button>
          {okComponent ? (
            okComponent
          ) : (
            <button onClick={onOk}>{okLabel ?? 'Save'}</button>
          )}
        </form>
      </header>

      <main className={`${styles.main} ${MainProps?.className}`} {...MainProps}>
        {children}
      </main>
    </dialog>,
    document.body
  );
};

export default Modal;
