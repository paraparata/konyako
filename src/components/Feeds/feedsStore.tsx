import { createStore, useStore } from 'zustand';
import { createContext, useContext, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

export type FeedType = {
  id: string;
  title: string | null;
  parent: { id: string; title: string } | null;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: null | string;
};

export type EditableFeedType = Pick<FeedType, 'title' | 'content'>;

export type FeedStoreState = {
  feeds: FeedType[];
  activeIndex: number;
};
type FeedsStoreAction = {
  addNewFeed: () => void;
  deleteFeed: () => void;
  setActiveIndex: (activeIndex: number) => void;
  setFeed: <T extends keyof EditableFeedType>(
    feedIndex: number,
    key: T,
    val: FeedType[T]
  ) => void;
  reset: () => void;
};
type FeedsStore = FeedStoreState & {
  action: FeedsStoreAction;
};

type CreatorReturner = ReturnType<typeof createFeedsStore>;

const initFeed = (id: string): FeedType => ({
  id: id,
  title: null,
  parent: null,
  content: '',
  tags: null,
  created_at: new Date().toISOString(),
  updated_at: null,
});

const createFeedsStore = (initState?: Partial<FeedStoreState>) => {
  const DEFAULT_STATES: FeedStoreState = {
    feeds: [initFeed(nanoid())],
    activeIndex: 0,
  };

  return createStore(
    immer<FeedsStore>((set) => ({
      ...DEFAULT_STATES,
      ...initState,
      action: {
        addNewFeed: () =>
          set((state) => {
            state.feeds.splice(state.activeIndex + 1, 0, initFeed(nanoid()));
            ++state.activeIndex;
          }),
        deleteFeed: () =>
          set((state) => {
            state.feeds.splice(state.activeIndex, 1);
            --state.activeIndex;
          }),
        setFeed: (feedIndex, key, val) =>
          set((state) => {
            state.feeds[feedIndex][key] = val;
          }),
        setActiveIndex: (activeIndex) => set({ activeIndex }),
        reset: () => set(DEFAULT_STATES),
      },
    }))
  );
};

const FeedsCtx = createContext<CreatorReturner | null>(null);

export const FeedsProvider = ({
  initState,
  children,
}: {
  initState?: Partial<FeedStoreState>;
  children: React.ReactNode;
}) => {
  const storeRef = useRef<CreatorReturner>();
  const initRef = useRef<Partial<FeedStoreState> | undefined>();

  useEffect(() => {
    if (
      initState &&
      JSON.stringify(initRef.current) !== JSON.stringify(initState)
    )
      initRef.current = initState;
  }, [initState]);

  if (
    !storeRef.current ||
    JSON.stringify(initRef.current) !== JSON.stringify(initState)
  )
    storeRef.current = createFeedsStore(initState);

  return (
    <FeedsCtx.Provider value={storeRef.current}>{children}</FeedsCtx.Provider>
  );
};

export function useFeedsStore<T>(
  selector: (state: FeedsStore) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(FeedsCtx);

  if (store === null) throw new Error('Missing FeedsCtx.Provider in the tree');
  return useStore(store, selector, equalityFn);
}
