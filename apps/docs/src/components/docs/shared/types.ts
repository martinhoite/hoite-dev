export type RouteCard = {
  body: string;
  href: string;
  label: string;
};

export type StorybookLink = {
  href: string;
  label: string;
  summary: string;
};

export type DocsHeroAction = {
  href: string;
  label: string;
  tone?: 'primary' | 'secondary';
};

export type DocsHeroMetric = {
  label: string;
  token: string;
};

export type DocsHeroPanel = {
  body: string;
  href?: string;
  label: string;
  linkLabel?: string;
  tone?: 'accent' | 'brand' | 'neutral';
};

export type SourceLink = {
  label: string;
  path: string;
};
