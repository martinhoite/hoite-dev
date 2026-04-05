export type UmbracoDocTypeAliasConfigKey =
  | 'excludedDocTypeAliases'
  | 'routingExcludedDocTypeAliases';

export class UmbracoExcludedContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UmbracoExcludedContentError';
  }
}

export class UmbracoConfigurationError extends Error {
  readonly configKey?: UmbracoDocTypeAliasConfigKey;

  constructor(message: string, options: { configKey?: UmbracoDocTypeAliasConfigKey } = {}) {
    super(message);
    this.name = 'UmbracoConfigurationError';
    this.configKey = options.configKey;
  }
}

export class UmbracoRequestError extends Error {
  override readonly cause: unknown;
  readonly statusCode?: number;

  constructor(message: string, options: { cause?: unknown; statusCode?: number } = {}) {
    super(message);
    this.name = 'UmbracoRequestError';
    this.cause = options.cause;
    this.statusCode = options.statusCode;
  }
}
