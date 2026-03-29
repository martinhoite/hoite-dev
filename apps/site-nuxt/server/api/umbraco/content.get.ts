import type { UmbracoContentQueryParameters } from '@hoite-dev/content-client';

import { getHeader, getQuery } from 'h3';

import {
  createServerUmbracoClient,
  getNumberValue,
  getStringOrStringArrayValue,
  getStringValue,
  toUmbracoHttpError,
} from '../../utils/umbracoClient';

export default defineEventHandler(async (event) => {
  const client = createServerUmbracoClient();
  const query = getQuery(event);

  const parameters: UmbracoContentQueryParameters = {
    expand: getStringValue(query.expand),
    fetch: getStringValue(query.fetch),
    fields: getStringValue(query.fields),
    filter: getStringOrStringArrayValue(query.filter),
    skip: getNumberValue(query.skip),
    sort: getStringOrStringArrayValue(query.sort),
    take: getNumberValue(query.take),
  };

  try {
    return await client.getContent(parameters, {
      locale: getHeader(event, 'accept-language') ?? undefined,
      startItem: getHeader(event, 'x-start-item') ?? undefined,
    });
  } catch (error) {
    throw toUmbracoHttpError(error);
  }
});
