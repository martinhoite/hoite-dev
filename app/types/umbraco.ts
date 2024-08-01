export type SimplifiedUmbracoLink = {
  url: URLString | null;
  title: string;
  target: '_blank' | '_self' | '_parent' | '_top' | null;
};

export type UmbracoLink = Expand<SimplifiedUmbracoLink> & {
  queryString: string | string[] | null;
  destinationId: string;
  destinationType: string;
};
