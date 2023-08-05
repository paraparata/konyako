import { useConfigs, type ConfigsStore } from './useConfigs';
import { useFeeds, type FeedStoreState } from './useFeeds';
import { useEditor, type EditorStoreState } from './useEditor';
import type { StoreApi } from 'zustand';

export type StoreGetterSetter = {
  configs: ConfigsStore;
  feeds: FeedStoreState;
  editor: EditorStoreState;
};

export type StoreSetterState<T extends keyof StoreGetterSetter> = Parameters<
  StoreApi<StoreGetterSetter[T]>['setState']
>[0];

/**
 * Helper for getting state of store from outside component.
 *
 * @param store A string either `'meeting' | 'socket'`. `meeting` from {@link useMeetingStore} and `socket` from {@link useMeetingSocketStore}
 * @param state A string from one of state in selected `store`
 * @returns A value from `state`
 */
export const storeGetter = <
  T extends keyof StoreGetterSetter,
  S extends keyof StoreGetterSetter[T],
  R extends StoreGetterSetter[T][S],
>(
  store: T,
  state: S
): R => {
  if (store === 'configs')
    return useConfigs.getState()[state as keyof ConfigsStore] as R;
  if (store === 'feeds')
    return useFeeds.getState()[state as keyof FeedStoreState] as R;
  if (store === 'editor')
    return useEditor.getState()[state as keyof EditorStoreState] as R;
  return undefined as R;
};

/**
 * Helper for setting state of store from outside component.
 *
 * @param store A string either `'meeting' | 'socket'`. `meeting` from {@link useMeetingStore} and `socket` from {@link useMeetingSocketStore}
 * @param state An object from partial of state in selected `store`
 */
export const storeSetter = <
  T extends keyof StoreGetterSetter,
  S extends StoreSetterState<T>,
>(
  store: T,
  state: S
) => {
  if (store === 'configs')
    useConfigs.setState(state as StoreSetterState<'configs'>);
  if (store === 'feeds') useFeeds.setState(state as StoreSetterState<'feeds'>);
  if (store === 'editor')
    useEditor.setState(state as StoreSetterState<'editor'>);
};
