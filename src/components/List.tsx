import styles from './List.module.css';

export const List = <T,>({
  data,
  children,
}: {
  data: T[] | undefined;
  children: (data: T[]) => React.ReactNode;
}) => {
  if (data === undefined)
    return <div className={styles['loading']}>Loading...</div>;
  if (data.length === 0)
    return <div className={styles['no-data']}>No Data</div>;

  return children(data);
};
