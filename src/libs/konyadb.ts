import { castDraft, produce } from 'immer';

type GenericObj<Val> = Record<string, Val>;

const has = <T extends object, K extends string>(src: T, key: K) =>
  Object.keys(src).includes(key);

const crud = {
  create: <Val>(src: GenericObj<Val>, [key, data]: [string, Val]) => [
    has(src, key)
      ? null
      : produce(src, (draft) => {
          draft[key] = castDraft(data);
        }),
    has(src, key) ? new Error('key already occupied') : null,
  ],
  read: <Val>(src: GenericObj<Val>, key: string) => [
    has(src, key) ? src[key] : null,
    has(src, key) ? null : new Error('key is not set'),
  ],
  update: <Val>(src: GenericObj<Val>, [key, data]: [string, Partial<Val>]) => [
    has(src, key)
      ? produce(src, (draft) => {
          draft[key] = castDraft({ ...src[key], ...data });
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

export { has, crud };
