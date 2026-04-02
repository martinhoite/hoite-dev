export interface paths {
  '/umbraco/delivery/api/v2/content': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetContent2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/content/item/{path}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetContentItemByPath2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/content/item/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetContentItemById2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/content/items': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetContentItems2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/media': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetMedia2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/media/item/{path}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetMediaItemByPath2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/media/item/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetMediaItemById2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/umbraco/delivery/api/v2/media/items': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['GetMediaItems2.0'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    ApiContentResponseModel: {
      /** Format: uuid */
      id: string;
      contentType: string;
      properties: {
        [key: string]: unknown;
      };
      name: string;
      /** Format: date-time */
      createDate: string;
      /** Format: date-time */
      updateDate: string;
      route: components['schemas']['ApiContentRouteModel'];
      cultures: {
        [key: string]: components['schemas']['ApiContentRouteModel'];
      };
    };
    ApiContentRouteModel: {
      path: string;
      queryString?: string | null;
      startItem: components['schemas']['ApiContentStartItemModel'];
    };
    ApiContentStartItemModel: {
      /** Format: uuid */
      id: string;
      path: string;
    };
    ApiMediaWithCropsResponseModel: {
      /** Format: uuid */
      readonly id: string;
      readonly name: string;
      readonly mediaType: string;
      readonly url: string;
      readonly extension?: string | null;
      /** Format: int32 */
      readonly width?: number | null;
      /** Format: int32 */
      readonly height?: number | null;
      /** Format: int32 */
      readonly bytes?: number | null;
      readonly properties: {
        [key: string]: unknown;
      };
      focalPoint?: components['schemas']['ImageFocalPointModel'] | null;
      crops?: components['schemas']['ImageCropModel'][] | null;
      path: string;
      /** Format: date-time */
      createDate: string;
      /** Format: date-time */
      updateDate: string;
    };
    ImageCropCoordinatesModel: {
      /** Format: double */
      x1: number;
      /** Format: double */
      y1: number;
      /** Format: double */
      x2: number;
      /** Format: double */
      y2: number;
    };
    ImageCropModel: {
      alias?: string | null;
      /** Format: int32 */
      width: number;
      /** Format: int32 */
      height: number;
      coordinates?: components['schemas']['ImageCropCoordinatesModel'] | null;
    };
    ImageFocalPointModel: {
      /** Format: double */
      left: number;
      /** Format: double */
      top: number;
    };
    PagedIApiContentResponseModel: {
      /** Format: int64 */
      total: number;
      items: components['schemas']['ApiContentResponseModel'][];
    };
    PagedIApiMediaWithCropsResponseModel: {
      /** Format: int64 */
      total: number;
      items: components['schemas']['ApiMediaWithCropsResponseModel'][];
    };
    ProblemDetails: {
      type?: string | null;
      title?: string | null;
      /** Format: int32 */
      status?: number | null;
      detail?: string | null;
      instance?: string | null;
    } & {
      [key: string]: unknown;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  'GetContent2.0': {
    parameters: {
      query?: {
        /** @description Specifies the content items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        fetch?: string;
        /** @description Defines how to filter the fetched content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        filter?: string[];
        /** @description Defines how to sort the found content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        sort?: string[];
        /** @description Specifies the number of found content items to skip. Use this to control pagination of the response. */
        skip?: number;
        /** @description Specifies the number of found content items to take. Use this to control pagination of the response. */
        take?: number;
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description Defines the language to return. Use this when querying language variant content items. */
        'Accept-Language'?: string;
        /** @description Defines the segment to return. Use this when querying segment variant content items. */
        'Accept-Segment'?: string;
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
        /** @description Whether to request draft content. */
        Preview?: boolean;
        /** @description URL segment or GUID of a root content item. */
        'Start-Item'?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PagedIApiContentResponseModel'];
        };
      };
      /** @description Bad Request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ProblemDetails'];
        };
      };
      /** @description Not Found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetContentItemByPath2.0': {
    parameters: {
      query?: {
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description Defines the language to return. Use this when querying language variant content items. */
        'Accept-Language'?: string;
        /** @description Defines the segment to return. Use this when querying segment variant content items. */
        'Accept-Segment'?: string;
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
        /** @description Whether to request draft content. */
        Preview?: boolean;
        /** @description URL segment or GUID of a root content item. */
        'Start-Item'?: string;
      };
      path: {
        path: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiContentResponseModel'];
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Not Found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetContentItemById2.0': {
    parameters: {
      query?: {
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description Defines the language to return. Use this when querying language variant content items. */
        'Accept-Language'?: string;
        /** @description Defines the segment to return. Use this when querying segment variant content items. */
        'Accept-Segment'?: string;
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
        /** @description Whether to request draft content. */
        Preview?: boolean;
        /** @description URL segment or GUID of a root content item. */
        'Start-Item'?: string;
      };
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiContentResponseModel'];
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Not Found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetContentItems2.0': {
    parameters: {
      query?: {
        id?: string[];
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description Defines the language to return. Use this when querying language variant content items. */
        'Accept-Language'?: string;
        /** @description Defines the segment to return. Use this when querying segment variant content items. */
        'Accept-Segment'?: string;
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
        /** @description Whether to request draft content. */
        Preview?: boolean;
        /** @description URL segment or GUID of a root content item. */
        'Start-Item'?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiContentResponseModel'][];
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetMedia2.0': {
    parameters: {
      query?: {
        /** @description Specifies the media items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        fetch?: string;
        /** @description Defines how to filter the fetched media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        filter?: string[];
        /** @description Defines how to sort the found media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        sort?: string[];
        /** @description Specifies the number of found media items to skip. Use this to control pagination of the response. */
        skip?: number;
        /** @description Specifies the number of found media items to take. Use this to control pagination of the response. */
        take?: number;
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PagedIApiMediaWithCropsResponseModel'];
        };
      };
      /** @description Bad Request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ProblemDetails'];
        };
      };
    };
  };
  'GetMediaItemByPath2.0': {
    parameters: {
      query?: {
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
      };
      path: {
        path: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiMediaWithCropsResponseModel'];
        };
      };
      /** @description Not Found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetMediaItemById2.0': {
    parameters: {
      query?: {
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
      };
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiMediaWithCropsResponseModel'];
        };
      };
      /** @description Not Found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  'GetMediaItems2.0': {
    parameters: {
      query?: {
        id?: string[];
        /** @description Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        expand?: string;
        /** @description Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this. */
        fields?: string;
      };
      header?: {
        /** @description API key specified through configuration to authorize access to the API. */
        'Api-Key'?: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApiMediaWithCropsResponseModel'][];
        };
      };
    };
  };
}
