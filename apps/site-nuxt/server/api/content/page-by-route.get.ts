import { createError, getQuery } from 'h3';

import {
  createServerUmbracoContentClient,
  getBooleanValue,
  getLocaleValue,
  getRoutePathValue,
  toContentHttpError,
} from '../../utils/contentClient';

export default defineEventHandler(async (event) => {
  try {
    const client = createServerUmbracoContentClient();
    const query = getQuery(event);
    const path = getRoutePathValue(query.path);

    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing path query parameter.',
      });
    }

    return await client.getPageByRoute({
      locale: getLocaleValue(query.locale),
      path,
      preview: getBooleanValue(query.preview),
    });
  } catch (error) {
    throw toContentHttpError(error);
  }
});
