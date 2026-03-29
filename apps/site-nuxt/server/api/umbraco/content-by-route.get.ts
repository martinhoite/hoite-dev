import { createError, getHeader, getQuery } from 'h3';

import { createServerUmbracoClient, toUmbracoHttpError } from '../../utils/umbracoClient';

export default defineEventHandler(async (event) => {
  const client = createServerUmbracoClient();
  const query = getQuery(event);
  const path = Array.isArray(query.path) ? query.path[0] : query.path;

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing path query parameter.',
    });
  }

  try {
    return await client.getContentByRoute(path, {
      locale: getHeader(event, 'accept-language') ?? undefined,
      startItem: getHeader(event, 'x-start-item') ?? undefined,
    });
  } catch (error) {
    throw toUmbracoHttpError(error);
  }
});
