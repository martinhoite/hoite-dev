import { getQuery } from 'h3';

import {
  createServerContentClient,
  getBooleanValue,
  getLocaleValue,
  getStartItemValue,
  toContentHttpError,
} from '../../utils/contentClient';

export default defineEventHandler(async (event) => {
  const client = createServerContentClient();
  const query = getQuery(event);

  try {
    return await client.getNavigation({
      locale: getLocaleValue(query.locale),
      preview: getBooleanValue(query.preview),
      startItem: getStartItemValue(query.startItem),
    });
  } catch (error) {
    throw toContentHttpError(error);
  }
});
