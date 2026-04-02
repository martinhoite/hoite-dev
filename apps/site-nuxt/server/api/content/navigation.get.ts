import { getQuery } from 'h3';

import {
  createServerUmbracoContentClient,
  getBooleanValue,
  getLocaleValue,
  toContentHttpError,
} from '../../utils/contentClient';

export default defineEventHandler(async (event) => {
  const client = createServerUmbracoContentClient();
  const query = getQuery(event);

  try {
    return await client.getNavigation({
      locale: getLocaleValue(query.locale),
      preview: getBooleanValue(query.preview),
    });
  } catch (error) {
    throw toContentHttpError(error);
  }
});
