import { $fetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';

/**
 * The base API to use for all API calls to Umbraco.
 */
export async function UseFetch<T>(path: string, opt: FetchOptions<'json'> = {}, baseUrl: string = '') {
  const {
    public: { apiBase }
  } = useRuntimeConfig();

  return await $fetch<T>(path, {
    baseURL: baseUrl !== '' ? baseUrl : apiBase,
    cache: 'no-cache',
    keepalive: true,
    ...opt
  });
}
