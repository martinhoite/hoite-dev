import type {
  ContentId,
  DocTypeAlias,
  HtmlString,
  IsoDateOnlyString,
  IsoDateString,
  LocaleCode,
  RoutePath,
  StartItemKey,
  UrlString,
} from '../types/opaque';

const ROOT_RELATIVE_URL_REGEX = /^\/(?!\/).*/;

export function isIsoDateString(value: unknown): value is IsoDateString {
  const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

  return typeof value === 'string' && isoDateTimeRegex.test(value);
}

export function toIsoDateString(value: string): IsoDateString {
  if (!isIsoDateString(value)) {
    throw new Error(`Invalid IsoDateString: ${value}`);
  }

  return value as IsoDateString;
}

export function isIsoDateOnlyString(value: unknown): value is IsoDateOnlyString {
  const isoDateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

  return typeof value === 'string' && isoDateOnlyRegex.test(value);
}

export function toIsoDateOnlyString(value: string): IsoDateOnlyString {
  if (!isIsoDateOnlyString(value)) {
    throw new Error(`Invalid IsoDateOnlyString: ${value}`);
  }

  return value as IsoDateOnlyString;
}

export function isContentId(value: unknown): value is ContentId {
  const contentIdRegex = /^\S(?:.*\S)?$/;

  return typeof value === 'string' && contentIdRegex.test(value);
}

export function toContentId(value: string): ContentId {
  if (!isContentId(value)) {
    throw new Error(`Invalid ContentId: ${value}`);
  }

  return value as ContentId;
}

export function isDocTypeAlias(value: unknown): value is DocTypeAlias {
  const docTypeAliasRegex = /^[a-z][A-Za-z0-9]*$/;

  return typeof value === 'string' && docTypeAliasRegex.test(value);
}

export function toDocTypeAlias(value: string): DocTypeAlias {
  if (!isDocTypeAlias(value)) {
    throw new Error(`Invalid DocTypeAlias: ${value}`);
  }

  return value as DocTypeAlias;
}

export function isLocaleCode(value: unknown): value is LocaleCode {
  const localeCodeRegex = /^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/;

  return typeof value === 'string' && localeCodeRegex.test(value);
}

export function toLocaleCode(value: string): LocaleCode {
  if (!isLocaleCode(value)) {
    throw new Error(`Invalid LocaleCode: ${value}`);
  }

  return value as LocaleCode;
}

export function isRoutePath(value: unknown): value is RoutePath {
  return typeof value === 'string' && ROOT_RELATIVE_URL_REGEX.test(value);
}

export function toRoutePath(value: string): RoutePath {
  if (!isRoutePath(value)) {
    throw new Error(`Invalid RoutePath: ${value}`);
  }

  return value as RoutePath;
}

export function isStartItemKey(value: unknown): value is StartItemKey {
  const startItemKeyRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

  return typeof value === 'string' && startItemKeyRegex.test(value);
}

export function toStartItemKey(value: string): StartItemKey {
  if (!isStartItemKey(value)) {
    throw new Error(`Invalid StartItemKey: ${value}`);
  }

  return value as StartItemKey;
}

export function isUrlString(value: unknown): value is UrlString {
  if (typeof value !== 'string') {
    return false;
  }

  if (ROOT_RELATIVE_URL_REGEX.test(value)) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function toUrlString(value: string): UrlString {
  if (!isUrlString(value)) {
    throw new Error(`Invalid UrlString: ${value}`);
  }

  return value as UrlString;
}

export function isHtmlString(value: unknown): value is HtmlString {
  const htmlTagRegex = /<[^>]+>/;

  return typeof value === 'string' && htmlTagRegex.test(value);
}

export function toHtmlString(value: string): HtmlString {
  if (!isHtmlString(value)) {
    throw new Error(`Invalid HtmlString: ${value}`);
  }

  return value as HtmlString;
}
