import { Immutable, produce } from 'immer';
import type { FeedType } from './useFeeds';

export const getFeed = async () => {
  const res = await fetch('/snapshot.json');
  const data = await res.json();

  return data as FeedType[];
};

const dummy = {
  id1: {
    name: 'ngana',
    age: 2,
  },
  id2: {
    name: 'p',
    age: 3,
  },
};

type GenericObj<Val> = Record<string, Val>;

const has = <T extends object, K extends string>(src: T, key: K) =>
  Object.keys(src).includes(key);

export const crud = {
  create: <Val>(src: GenericObj<Val>, [key, data]: [string, Val]) => [
    has(src, key)
      ? null
      : produce(src, (draft) => {
          draft[key] = data as any;
        }),
    has(src, key) ? new Error('key already occupied') : null,
  ],
  read: <Val>(src: GenericObj<Val>, key: string) => [
    has(src, key) ? src[key] : null,
    has(src, key) ? null : new Error('key is not set'),
  ],
  update: <Val>(src: GenericObj<Val>, [key, data]: [string, Val]) => [
    has(src, key)
      ? produce(src, (draft) => {
          draft[key] = data as any;
        })
      : null,
    has(src, key) ? null : new Error('key is not set'),
  ],
  delete: <Val, T extends GenericObj<Val>>(src: T, key: string) => [
    has(src, key)
      ? produce(src, (draft) => {
          delete draft[key];
        })
      : null,
    has(src, key) ? null : new Error('key is not set'),
  ],
};
