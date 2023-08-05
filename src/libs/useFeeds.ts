import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useConfigs } from './useConfigs';

type FeedType = {
  id: string;
  title: string | null;
  parent: { id: string; title: string } | null;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: null | string;
};

type EditableFeedType = Pick<FeedType, 'title' | 'content'>;

type FeedStoreState = {
  feeds: FeedType[];
  page: number;
  totalPage: number;
  isFetched: boolean;
  topics: FeedType[];
};

type FeedsStoreAction = {
  cancelEditFeed: () => Promise<void>;
  init: (
    feedsPath: string
  ) => Promise<Pick<FeedStoreState, 'feeds' | 'totalPage'>>;
  fetchFeeds: (feedsPath?: string) => Promise<FeedType[]>;
  fetchTotalPage: (feedsPath?: string) => Promise<number>;
  changePage: (to: number | 'prev' | 'next') => number;
  checkUpdate: () => Promise<Pick<FeedStoreState, 'feeds' | 'totalPage'>>;
  reset: () => void;
};

const DEFAULT_STATES: FeedStoreState = {
  feeds: [],
  page: 1,
  totalPage: 1,
  isFetched: false,
  topics: [],
};

const useFeeds = create<FeedStoreState>()(
  persist(() => DEFAULT_STATES, {
    name: 'konyako-tea-bag',
  })
);

const init: FeedsStoreAction['init'] = async (feedsPath) => {
  const totalPage = await fetchTotalPage(feedsPath);
  const feeds = await fetchFeeds(feedsPath);
  useFeeds.setState({ isFetched: true });
  useConfigs.setState({ feedsPath });

  return {
    totalPage,
    feeds,
  };
};

const fetchTotalPage: FeedsStoreAction['fetchTotalPage'] = async (
  feedsPath
) => {
  try {
    const url = (feedsPath ?? useConfigs.getState().feedsPath) + `total.json`;
    const res = await fetch(url);
    const rawTotal = await res.text();
    const { total } = JSON.parse(rawTotal);
    useFeeds.setState({ totalPage: Number(total) });

    return Number(total);
  } catch (error) {
    console.error(error);
    return 1;
  }
};

const fetchFeeds: FeedsStoreAction['fetchFeeds'] = async (feedsPath) => {
  try {
    const url =
      (feedsPath ?? useConfigs.getState().feedsPath) +
      `${useFeeds.getState().page}-feeds.json`;
    const res = await fetch(url);
    const rawFeeds = await res.text();
    const feeds = JSON.parse(rawFeeds);
    const topics = (feeds as FeedType[]).filter((feed) => feed.title !== null);
    useFeeds.setState({ feeds, topics });

    return feeds;
  } catch (error) {
    console.error(error);
  }
};

const cancelEditFeed: FeedsStoreAction['cancelEditFeed'] = async () => {
  try {
    const feeds = await fetchFeeds();
    useFeeds.setState({ feeds });
  } catch (error) {
    console.error(error);
  }
};

const changePage: FeedsStoreAction['changePage'] = (to) => {
  if (typeof to === 'string') {
    let page = useFeeds.getState().page;

    if (to === 'prev' && page !== 1) page--;
    if (to === 'next' && page !== useFeeds.getState().totalPage) page++;
    useFeeds.setState({ page });

    return page;
  }

  useFeeds.setState({ page: to });
  return to;
};

const checkUpdate: FeedsStoreAction['checkUpdate'] = async () => {
  const totalPage = await fetchTotalPage();
  const feeds = await fetchFeeds();

  return {
    totalPage,
    feeds,
  };
};

const reset: FeedsStoreAction['reset'] = () =>
  useFeeds.setState({ ...DEFAULT_STATES });

export {
  useFeeds,
  init,
  fetchFeeds,
  fetchTotalPage,
  cancelEditFeed,
  changePage,
  checkUpdate,
  reset,
};
export type { FeedType, EditableFeedType, FeedStoreState };
