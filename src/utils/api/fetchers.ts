import { ContentType } from '@/schemas/http/ContentType';
import { Header } from '@/schemas/http/Header';
import { HttpMethod } from '@/schemas/http/HttpMethod';
import { parseResponse } from './response-parser';

type FetcherKeyObj<Body> = {
  url: string;
  headers?: Record<string, string>;
  body?: Body;
};

// SWR needs the fetcher function to be able accept a string as the key even
// though for our usage, we will always be passing the FetcherKeyObj type object as the key
// biome-ignore lint/suspicious/noExplicitAny: not required here
export type FetcherKey<Body = any> = FetcherKeyObj<Body> | string;

function parseKey(key: FetcherKey) {
  return typeof key === 'string' ? { url: key } : key;
}

function createFetcher(method: HttpMethod) {
  // biome-ignore lint/suspicious/noExplicitAny: not required here
  return async function fetcher<ResponseBody = any, RequestBody = any>(
    key: FetcherKey<RequestBody>,
    { arg }: { arg?: RequestBody } = {}
  ) {
    const { url, headers, body } = parseKey(key);

    // If body is specified in both `body` in the first arg and in `arg` in the second arg,
    // then `body` in the first arg takes precedence.
    const requestPayload = body || arg;
    const res = await fetch(url, {
      headers: {
        ...(requestPayload && {
          [Header.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        }),
        ...headers,
      },
      method,
      ...(requestPayload && { body: JSON.stringify(requestPayload) }),
    });

    return await parseResponse<ResponseBody>(res);
  };
}

/**
 * GET fetcher that can be called directly or used with useSWR.
 * If `body` is specified in the fetcher key, it will override the body passed to `trigger()`.
 */
export const get = createFetcher(HttpMethod.enum.GET);

/**
 * POST fetcher that can be called directly or used with useSWRMutation.
 * If `body` is specified in the fetcher key, it will override the body passed to `trigger()`.
 */
export const post = createFetcher(HttpMethod.enum.POST);

/**
 * PUT fetcher that can be called directly or used with useSWRMutation.
 * If `body` is specified in the fetcher key, it will override the body passed to `trigger()`.
 */
export const put = createFetcher(HttpMethod.enum.PUT);

/**
 * PATCH fetcher that can be called directly or used with useSWRMutation.
 * If `body` is specified in the fetcher key, it will override the body passed to `trigger()`.
 */
export const patch = createFetcher(HttpMethod.enum.PATCH);

/**
 * DELETE fetcher that can be called directly or used with useSWRMutation.
 * If `body` is specified in the fetcher key, it will override the body passed to `trigger()`.
 */
export const del = createFetcher(HttpMethod.enum.DELETE);
