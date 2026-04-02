import type { ContentId, DocTypeAlias, RoutePath, StartItemKey, UrlString } from '../types/opaque';
import type {
  SimplifiedUmbracoLink,
  SiteSettingsLogo,
  UmbracoContentClientIssue,
  UmbracoContentClientIssueCode,
  UmbracoContentClientMethod,
  UmbracoContentItem,
  UmbracoContentRoute,
  UmbracoImage,
  UmbracoLink,
  UmbracoNavigationItem,
  UmbracoNavigationItemProperties,
  UmbracoPageResponse,
  UmbracoSiteSettings,
  UmbracoSiteSettingsResponse,
} from '../types/umbraco';
import {
  isContentId,
  isDocTypeAlias,
  isRoutePath,
  isStartItemKey,
  isUrlString,
  toContentId,
  toDocTypeAlias,
  toRoutePath,
  toStartItemKey,
  toUrlString,
} from './opaque-type-helpers';

type IssueReporter = (issue: UmbracoContentClientIssue) => void;

type IssueOperationContext = {
  contentType?: DocTypeAlias;
  method: UmbracoContentClientMethod;
  reportIssue?: IssueReporter;
};

type IssueFieldContext = IssueOperationContext & {
  child: (fieldSegment: string) => IssueFieldContext;
  field: string;
  report: (
    code: UmbracoContentClientIssueCode,
    actionTaken: UmbracoContentClientIssue['actionTaken'],
    details?: Pick<UmbracoContentClientIssue, 'receivedCount' | 'receivedValue'>,
  ) => void;
};

export const getSingleItemFromArray = <ItemType>(
  items: readonly ItemType[] | null | undefined,
): ItemType | null => {
  if (!items || items.length === 0) {
    return null;
  }

  return items[0] ?? null;
};

export const createIssueOperationContext = (
  options: IssueOperationContext,
): IssueOperationContext => {
  return options;
};

const createIssueFieldContext = (
  operation: IssueOperationContext,
  field: string,
): IssueFieldContext => ({
  ...operation,
  child: (fieldSegment) => createIssueFieldContext(operation, `${field}.${fieldSegment}`),
  field,
  report: (code, actionTaken, details) => {
    operation.reportIssue?.({
      actionTaken,
      code,
      contentType: operation.contentType,
      field,
      method: operation.method,
      ...details,
    });
  },
});

const getFieldContext = (operation: IssueOperationContext, field: string): IssueFieldContext => {
  return createIssueFieldContext(operation, field);
};

const getSingleItemFromArrayForField = <ItemType>(
  items: readonly ItemType[] | null | undefined,
  issue: IssueFieldContext,
): ItemType | null => {
  if (!items || items.length === 0) {
    return null;
  }

  if (items.length > 1) {
    issue.report('expected_single_item_array', 'used_first_item', {
      receivedCount: items.length,
    });
  }

  return items[0] ?? null;
};

const normalizeContentTheme = (
  value: string | null | undefined,
  issue: IssueFieldContext,
): 'dark' | 'light' => {
  const normalizedValue = value?.toLowerCase();

  if (normalizedValue === 'dark' || normalizedValue === 'light') {
    return normalizedValue;
  }

  issue.report('invalid_content_theme', 'used_default', {
    receivedValue: value,
  });

  return 'dark';
};

const normalizeOptionalUrl = (value: unknown, issue: IssueFieldContext): UrlString | null => {
  if (!isUrlString(value)) {
    issue.report('invalid_optional_url', 'returned_null', {
      receivedValue: value,
    });

    return null;
  }

  return toUrlString(value);
};

const normalizeRequiredContentId = (value: unknown, issue: IssueFieldContext): ContentId => {
  if (!isContentId(value)) {
    issue.report('invalid_required_value', 'returned_null', {
      receivedValue: value,
    });

    throw new Error(`Invalid content id for ${issue.field}.`);
  }

  return toContentId(value);
};

const normalizeRequiredDocTypeAlias = (value: unknown, issue: IssueFieldContext): DocTypeAlias => {
  if (!isDocTypeAlias(value)) {
    issue.report('invalid_required_value', 'returned_null', {
      receivedValue: value,
    });

    throw new Error(`Invalid document type alias for ${issue.field}.`);
  }

  return toDocTypeAlias(value);
};

const normalizeRequiredRoutePath = (value: unknown, issue: IssueFieldContext): RoutePath => {
  if (!isRoutePath(value)) {
    issue.report('invalid_required_value', 'returned_null', {
      receivedValue: value,
    });

    throw new Error(`Invalid route path for ${issue.field}.`);
  }

  return toRoutePath(value);
};

const normalizeRequiredStartItemKey = (value: unknown, issue: IssueFieldContext): StartItemKey => {
  if (!isStartItemKey(value)) {
    issue.report('invalid_required_value', 'returned_null', {
      receivedValue: value,
    });

    throw new Error(`Invalid start item key for ${issue.field}.`);
  }

  return toStartItemKey(value);
};

const normalizeContentRoute = (
  route: UmbracoContentRoute,
  issue: IssueFieldContext,
): UmbracoContentRoute => ({
  path: normalizeRequiredRoutePath(route.path, issue.child('path')),
  startItem: {
    id: normalizeRequiredContentId(route.startItem.id, issue.child('startItem').child('id')),
    path: normalizeRequiredStartItemKey(
      route.startItem.path,
      issue.child('startItem').child('path'),
    ),
  },
});

const normalizeImage = (
  image: UmbracoImage | null,
  issue: IssueFieldContext,
): UmbracoImage | null => {
  if (!image) {
    return null;
  }

  const url = normalizeOptionalUrl(image.url, issue.child('url'));

  if (!url) {
    return null;
  }

  return {
    ...image,
    id: normalizeRequiredContentId(image.id, issue.child('id')),
    url,
  };
};

const normalizeSiteSettingsLogo = (
  image: SiteSettingsLogo | null,
  issue: IssueFieldContext,
): SiteSettingsLogo | null => {
  if (!image) {
    return null;
  }

  const url = normalizeOptionalUrl(image.url, issue.child('url'));

  if (!url) {
    return null;
  }

  return {
    ...image,
    id: normalizeRequiredContentId(image.id, issue.child('id')),
    url,
  };
};

const normalizeImageArray = (
  images: readonly UmbracoImage[] | null | undefined,
  issue: IssueFieldContext,
): UmbracoImage[] | null => {
  if (!images || images.length === 0) {
    return null;
  }

  const normalizedImages: UmbracoImage[] = [];

  for (const image of images) {
    const normalizedImage = normalizeImage(image, issue);

    if (!normalizedImage) {
      return null;
    }

    normalizedImages.push(normalizedImage);
  }

  return normalizedImages;
};

export const toSimplifiedUmbracoLink = (
  links: readonly UmbracoLink[] | null | undefined,
  operation: IssueOperationContext,
  field: string,
): SimplifiedUmbracoLink | null => {
  const issue = getFieldContext(operation, field);
  const link = getSingleItemFromArrayForField(links, issue);

  if (!link) {
    return null;
  }

  const url = normalizeOptionalUrl(link.route.path, issue.child('url'));

  if (!url) {
    return null;
  }

  return {
    target: link.target,
    title: link.title,
    url,
  };
};

export const normalizeUmbracoSiteSettings = (
  siteSettings: UmbracoSiteSettingsResponse,
  operation: IssueOperationContext,
): UmbracoSiteSettings => ({
  defaultTheme: normalizeContentTheme(
    siteSettings.defaultTheme,
    getFieldContext(operation, 'defaultTheme'),
  ),
  footerLogo: normalizeSiteSettingsLogo(
    getSingleItemFromArrayForField(
      siteSettings.footerLogo,
      getFieldContext(operation, 'footerLogo'),
    ),
    getFieldContext(operation, 'footerLogo'),
  ),
  headerLogo: normalizeSiteSettingsLogo(
    getSingleItemFromArrayForField(
      siteSettings.headerLogo,
      getFieldContext(operation, 'headerLogo'),
    ),
    getFieldContext(operation, 'headerLogo'),
  ),
  headerLogoLink: toSimplifiedUmbracoLink(siteSettings.headerLogoLink, operation, 'headerLogoLink'),
  headerLogoText: siteSettings.headerLogoText,
  metaTitleExtension: siteSettings.metaTitleExtension || '',
  seoOpenGraphFallbackImage: normalizeImage(
    getSingleItemFromArrayForField(
      siteSettings.seoOpenGraphFallbackImage,
      getFieldContext(operation, 'seoOpenGraphFallbackImage'),
    ),
    getFieldContext(operation, 'seoOpenGraphFallbackImage'),
  ),
  seoTwitterFallbackImage: normalizeImage(
    getSingleItemFromArrayForField(
      siteSettings.seoTwitterFallbackImage,
      getFieldContext(operation, 'seoTwitterFallbackImage'),
    ),
    getFieldContext(operation, 'seoTwitterFallbackImage'),
  ),
});

export const normalizeUmbracoPageResponse = (
  page: UmbracoPageResponse,
  operation: IssueOperationContext,
): UmbracoPageResponse => {
  const canonicalUrlIssue = getFieldContext(operation, 'canonicalURL');
  const canonicalURL = page.canonicalURL
    ? {
        ...page.canonicalURL,
        url: normalizeOptionalUrl(page.canonicalURL.url, canonicalUrlIssue.child('url')),
      }
    : null;

  return {
    ...page,
    canonicalURL,
    seoOpenGraphImage: normalizeImageArray(
      page.seoOpenGraphImage,
      getFieldContext(operation, 'seoOpenGraphImage'),
    ),
    seoTwitterImage: normalizeImageArray(
      page.seoTwitterImage,
      getFieldContext(operation, 'seoTwitterImage'),
    ),
  };
};

export const normalizeUmbracoPageItem = (
  item: UmbracoContentItem<UmbracoPageResponse>,
  operation: IssueOperationContext,
): UmbracoContentItem<UmbracoPageResponse> => {
  const normalizedContentType = normalizeRequiredDocTypeAlias(
    item.contentType,
    getFieldContext(operation, 'contentType'),
  );
  const normalizedOperation = createIssueOperationContext({
    ...operation,
    contentType: normalizedContentType,
  });

  return {
    ...item,
    contentType: normalizedContentType,
    id: normalizeRequiredContentId(item.id, getFieldContext(normalizedOperation, 'id')),
    route: normalizeContentRoute(item.route, getFieldContext(normalizedOperation, 'route')),
    properties: normalizeUmbracoPageResponse(item.properties, normalizedOperation),
  };
};

export const buildUmbracoNavigation = (
  navigationItemsResponse: readonly UmbracoContentItem<UmbracoNavigationItemProperties>[],
  operation: IssueOperationContext,
): UmbracoNavigationItem[] => {
  const lookup = new Map<ContentId, UmbracoNavigationItem>();
  const pathsById = new Map<ContentId, RoutePath>();
  const parentEnabledById = new Map<ContentId, boolean>();

  for (const item of navigationItemsResponse) {
    if (!item.properties.includeInNavigation) {
      continue;
    }

    const itemIssue = getFieldContext(operation, `items.${item.id}`);
    const normalizedId = normalizeRequiredContentId(item.id, itemIssue.child('id'));
    const normalizedPath = normalizeRequiredRoutePath(
      item.route.path,
      itemIssue.child('route').child('path'),
    );

    lookup.set(normalizedId, {
      children: [],
      name: item.name,
      path: normalizedPath,
    });
    pathsById.set(normalizedId, normalizedPath);
    parentEnabledById.set(normalizedId, Boolean(item.properties.includeChildrenInNavigation));
  }

  const rootItems: UmbracoNavigationItem[] = [];

  for (const [itemId, currentNavItem] of lookup.entries()) {
    const itemPath = pathsById.get(itemId);

    if (!itemPath) {
      continue;
    }

    const itemPathSegments = itemPath.split('/').filter(Boolean);

    if (itemPathSegments.length <= 2) {
      rootItems.push(currentNavItem);
      continue;
    }

    const parentPath = toRoutePath(`/${itemPathSegments.slice(0, -1).join('/')}/`);
    const parentItemId = [...pathsById.entries()].find(([, path]) => path === parentPath)?.[0];

    if (!parentItemId) {
      rootItems.push(currentNavItem);
      continue;
    }

    const parentNavItem = lookup.get(parentItemId);

    if (parentNavItem && parentEnabledById.get(parentItemId)) {
      parentNavItem.children?.push(currentNavItem);
      continue;
    }

    rootItems.push(currentNavItem);
  }

  return rootItems;
};
