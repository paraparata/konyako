import { atom } from 'jotai';
import { nanoid } from 'nanoid';
import { atomFamily } from 'jotai/utils';

import type { FeedType } from './useFeeds';

type EditableFeedType = Pick<FeedType, 'title' | 'content'>;

const activeIndexAtom = atom(0);

const feedAtomFamily = atomFamily((id: FeedType['id']) =>
  atom<FeedType>({
    id,
    title: null,
    parent: null,
    content: '',
    tags: null,
    updated_at: null,
    created_at: new Date().toISOString(),
  })
);

const draftAtom = atom<string[]>([nanoid()]);

const contentIsEmptyAtom = atom((get) => {
  const activeId = get(draftAtom)[get(activeIndexAtom)];
  return !get(feedAtomFamily(activeId)).content;
});

const contentCounterAtom = (id: FeedType['id']) =>
  atom((get) => get(feedAtomFamily(id)).content.length);

const isComposerSaveDisabledAtom = atom((get) =>
  get(draftAtom).some((feedId) => get(feedAtomFamily(feedId)).content === '')
);

const addFeedAtom = atom(null, (_, set, update: FeedType['id']) => {
  feedAtomFamily(update);
  set(draftAtom, (prev) => [...prev, update]);
  set(activeIndexAtom, (prev) => prev + 1);
});

const deleteFeedAtom = atom(null, (_, set, update: FeedType['id']) => {
  feedAtomFamily.remove(update);
  set(draftAtom, (prev) => prev.filter((id) => id !== update));
  set(activeIndexAtom, (prev) => (prev === 0 ? 0 : prev - 1));
});

const editFeedAtom = atom(
  null,
  (_, set, update: [FeedType['id'], Partial<EditableFeedType>]) => {
    set(feedAtomFamily(update[0]), (prev) => ({ ...prev, ...update[1] }));
  }
);

const initEditorAtom = atom(
  null,
  (
    _,
    set,
    update: { feedIds: FeedType['id'][]; feeds: Record<string, FeedType> }
  ) => {
    set(draftAtom, update.feedIds);
    update.feedIds.forEach((id) => {
      if (Object.keys(update.feeds).includes(id))
        set(feedAtomFamily(id), update.feeds[id]);
    });
  }
);

const staticFeedsAtom = atom(null, (get, _) => {
  const draft = get(draftAtom);
  return draft.map((feedId) => get(feedAtomFamily(feedId)));
});

export {
  activeIndexAtom,
  feedAtomFamily,
  draftAtom,
  addFeedAtom,
  deleteFeedAtom,
  editFeedAtom,
  contentIsEmptyAtom,
  contentCounterAtom,
  isComposerSaveDisabledAtom,
  initEditorAtom,
  staticFeedsAtom,
};
