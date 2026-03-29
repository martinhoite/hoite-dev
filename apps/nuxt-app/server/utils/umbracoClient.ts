import {
  createUmbracoClient,
  defaultExcludedDocTypes,
  UmbracoExcludedContentError,
} from '@hoite-dev/api-client';
import { createError } from 'h3';

const getStringValue = (value: unknown) => {
  if (Array.isArray(value)) {
    const firstValue = value[0];
    return firstValue != null ? String(firstValue) : undefined;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return undefined;
};

export { getStringValue };

export const getNumberValue = (value: unknown) => {
  const resolved = getStringValue(value);

  if (!resolved) {
    return undefined;
  }

  const parsed = Number(resolved);

  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getStringOrStringArrayValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((item) => item != null).map((item) => String(item));
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return undefined;
};

export const toUmbracoHttpError = (error: unknown) => {
  if (error instanceof UmbracoExcludedContentError) {
    return createError({
      statusCode: 404,
      statusMessage: error.message,
    });
  }

  return error;
};

export const createServerUmbracoClient = () => {
  const config = useRuntimeConfig();

  if (!config.umbracoBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_UMBRACO_BASE_URL runtime configuration.',
    });
  }

  const excludedDocTypes = config.umbracoExcludedDocTypes
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return createUmbracoClient({
    baseUrl: config.umbracoBaseUrl,
    deliveryApiKey: config.umbracoDeliveryApiKey || undefined,
    excludedDocTypes: excludedDocTypes.length > 0 ? excludedDocTypes : defaultExcludedDocTypes,
  });
};
