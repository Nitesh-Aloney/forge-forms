type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type UndefinedOrNull = undefined | null;

type MaybePromise<T> = T | Promise<T>;

type JsonArray = Array<Json>;
type JsonObject = { [key: string]: Json };
type Json = null | boolean | number | string | JsonArray | JsonObject;
