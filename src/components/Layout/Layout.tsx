import FetchFirst from '@components/FetchFirst';
import NewFeedBtn from '@components/NewFeedBtn';
import CheckUpdate from '@components/CheckUpdate';
import styles from './Layout.module.css';
import { GearSix, List, NewspaperClipping, Tree, X } from 'phosphor-react';
import { NavLink } from '../Link';
import { useFeeds } from '@libs/useFeeds';
import { useConfigs } from '@libs/useConfigs';

const ROUTES = [
  {
    to: '/',
    title: 'Timeline',
    icon: (isActive: boolean) => (
      <NewspaperClipping
        weight='duotone'
        size={25}
        style={{ color: isActive ? 'var(--sc-midnight)' : 'inherit' }}
      />
    ),
  },
  {
    to: '/topic',
    title: 'Topic',
    icon: (isActive: boolean) => (
      <Tree
        weight='duotone'
        size={25}
        style={{ color: isActive ? 'var(--sc-orange)' : 'inherit' }}
      />
    ),
  },
  {
    to: '/settings',
    title: 'Settings',
    icon: (isActive: boolean) => (
      <GearSix
        weight='duotone'
        size={25}
        style={{ color: isActive ? 'var(--sc-red)' : 'inherit' }}
      />
    ),
  },
];

const RoutesNav = () => (
  <nav className={styles['routes-nav']}>
    <ul>
      {ROUTES.map((route) => (
        <li key={route.to}>
          <NavLink href={route.to}>
            {(isActive) => (
              <>
                {route.icon(isActive)}
                <span>{route.title}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

const LeftNav = () => {
  const isMenuOpen = useConfigs((state) => state.isMenuOpen);

  const toggleOpen = () =>
    useConfigs.setState((prev) => ({ isMenuOpen: !prev.isMenuOpen }));

  return (
    <div className={styles['left-nav']}>
      <button data-kind='icon' onClick={toggleOpen}>
        {isMenuOpen ? (
          <X size={20} style={{ color: 'var(--sc-red)' }} />
        ) : (
          <List size={20} weight='fill' />
        )}
      </button>

      {isMenuOpen ? <RoutesNav /> : <span data-konyako='true'>konyako</span>}
    </div>
  );
};

const RightNav = () => (
  <nav className={styles['right-nav']}>
    <ul>
      <li>
        <CheckUpdate />
      </li>
      <li>
        <NewFeedBtn />
      </li>
    </ul>
  </nav>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isFetched = useFeeds((state) => state.isFetched);

  if (!isFetched) return <FetchFirst />;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <LeftNav />
        <RightNav />
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>
          🍞 Baked by paraparata &#169; {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default Layout;
