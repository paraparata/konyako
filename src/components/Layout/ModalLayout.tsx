import styles from './ModalLayout.module.css';

interface ModalLayoutProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const ModalHeader: React.FC<ModalLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <header className={`${styles.header} ${className}`} {...props}>
      {children}
    </header>
  );
};

export const ModalMain: React.FC<ModalLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <main className={`${styles.main} ${className}`} {...props}>
      {children}
    </main>
  );
};

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={`${styles.root} ${className}`} {...props}>
      {children}
    </div>
  );
};
