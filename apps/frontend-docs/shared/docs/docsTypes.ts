export type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type ComponentDocs = {
  description: readonly string[];
  sections: readonly DocsSection[];
  title: string;
};
