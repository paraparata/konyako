import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { FeedType } from './useFeeds';

type EditableFeedType = Pick<FeedType, 'title' | 'content'>;

type EditorStoreState = {
  activeIndex: number;
  draft: FeedType[];
};

type EditorStoreAction = {
  setActiveIndex: (activeIndex: number) => void;
  addNewFeed: () => void;
  deleteFeed: () => void;
  editFeed: <T extends keyof EditableFeedType>(
    feedIndex: number,
    key: T,
    val: FeedType[T]
  ) => void;
  reset: () => void;
};

const initFeed = (id: string): FeedType => ({
  id: id,
  title: null,
  parent: null,
  content: '',
  tags: null,
  created_at: new Date().toISOString(),
  updated_at: null,
});

const DEFAULT_STATES: EditorStoreState = {
  activeIndex: 0,
  draft: [initFeed(nanoid())],
};

const useEditor = create<EditorStoreState>()(() => DEFAULT_STATES);

const setActiveIndex: EditorStoreAction['setActiveIndex'] = (activeIndex) =>
  useEditor.setState({ activeIndex });

const addNewFeed = () =>
  useEditor.setState((state) =>
    produce(state, (d) => {
      d.draft.splice(d.activeIndex + 1, 0, initFeed(nanoid()));
      ++d.activeIndex;
    })
  );

const deleteFeed = () =>
  useEditor.setState((state) =>
    produce(state, (d) => {
      d.draft.splice(d.activeIndex, 1);
      --d.activeIndex;
    })
  );

const editFeed: EditorStoreAction['editFeed'] = (feedIndex, key, val) =>
  useEditor.setState((state) =>
    produce(state, (d) => {
      d.draft[feedIndex][key] = val;
    })
  );

const reset: EditorStoreAction['reset'] = () =>
  useEditor.setState({ ...DEFAULT_STATES });

export {
  initFeed,
  useEditor,
  setActiveIndex,
  addNewFeed,
  deleteFeed,
  editFeed,
  reset,
};
export type { EditableFeedType, EditorStoreState };
