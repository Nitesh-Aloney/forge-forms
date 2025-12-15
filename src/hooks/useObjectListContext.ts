import { createContext, use } from 'react';

export type TObjectListContext = {
  prefix: string;
  itemIdx?: number;
};

export const ObjectListContext = createContext<TObjectListContext>({ prefix: '' });

export function useObjectListContext() {
  const ctx = use(ObjectListContext);
  return ctx;
}
