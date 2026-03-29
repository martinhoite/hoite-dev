import type { FetchOptions } from 'ofetch';
import { $fetch } from 'ofetch';

/**
 * The base API to use for all API calls to Umbraco.
 */
export async function UseFetch<T>(
  path: string,
  opt: FetchOptions<'json'> = {},
  baseUrl: string = '',
) {
  return await $fetch<T>(path, {
    baseURL: baseUrl !== '' ? baseUrl : undefined,
    cache: 'no-cache',
    keepalive: true,
    ...opt,
  });
}
