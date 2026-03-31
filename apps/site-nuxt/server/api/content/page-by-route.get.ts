import { createError, getQuery } from 'h3';

import {
  createServerContentClient,
  getBooleanValue,
  getLocaleValue,
  getRoutePathValue,
  getStartItemValue,
  toContentHttpError,
} from '../../utils/contentClient';

export default defineEventHandler(async (event) => {
  const client = createServerContentClient();
  const query = getQuery(event);
  const path = getRoutePathValue(query.path);

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing path query parameter.',
    });
  }

  try {
    return await client.getPageByRoute({
      locale: getLocaleValue(query.locale),
      path,
      preview: getBooleanValue(query.preview),
      startItem: getStartItemValue(query.startItem),
    });
  } catch (error) {
    throw toContentHttpError(error);
  }
});
