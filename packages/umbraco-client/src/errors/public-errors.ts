import {
  UmbracoConfigurationError,
  UmbracoExcludedContentError,
  UmbracoRequestError,
} from './umbraco-errors';

export const umbracoPublicErrorCodes = {
  contentConfigurationError: 'content-configuration-error',
  contentNotFound: 'content-not-found',
  contentServiceError: 'content-service-error',
} as const;

export type UmbracoPublicErrorCode =
  (typeof umbracoPublicErrorCodes)[keyof typeof umbracoPublicErrorCodes];

export type UmbracoPublicErrorInfo = {
  code: UmbracoPublicErrorCode;
  statusCode: 404 | 500 | 502;
};

const publicErrorCodeSet = new Set<UmbracoPublicErrorCode>(Object.values(umbracoPublicErrorCodes));

export const isUmbracoPublicErrorCode = (value: unknown): value is UmbracoPublicErrorCode => {
  return typeof value === 'string' && publicErrorCodeSet.has(value as UmbracoPublicErrorCode);
};

export const getUmbracoPublicErrorInfo = (error: unknown): UmbracoPublicErrorInfo | null => {
  if (
    error instanceof UmbracoExcludedContentError ||
    (error instanceof UmbracoRequestError && error.statusCode === 404)
  ) {
    return {
      code: umbracoPublicErrorCodes.contentNotFound,
      statusCode: 404,
    };
  }

  if (error instanceof UmbracoConfigurationError) {
    return {
      code: umbracoPublicErrorCodes.contentConfigurationError,
      statusCode: 500,
    };
  }

  if (error instanceof UmbracoRequestError) {
    return {
      code: umbracoPublicErrorCodes.contentServiceError,
      statusCode: 502,
    };
  }

  return null;
};
