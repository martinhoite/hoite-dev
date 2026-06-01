export type TokenLeaf = {
  $description?: string;
  $extensions?: {
    'com.figma.codeSyntax'?: {
      WEB?: string;
    };
  };
  $type: string;
  $value: unknown;
};

export type TokenPreviewKind =
  | 'color'
  | 'layout-container'
  | 'layout-grid-columns'
  | 'layout-gutter'
  | 'motion-duration'
  | 'motion-easing'
  | 'radius'
  | 'size'
  | 'spacing'
  | 'stroke'
  | 'text'
  | 'typography-family'
  | 'typography-letter-spacing'
  | 'typography-line-height'
  | 'typography-paragraph-spacing'
  | 'typography-size'
  | 'typography-weight'
  | 'z-stack';

export type TokenReferenceRow = {
  description: string;
  previewKind: TokenPreviewKind;
  rawValue: unknown;
  token: string;
};

export type TokenSection = {
  navLabel: string;
  rows: readonly TokenReferenceRow[];
  slug: string;
};

export type ThemedColorReferenceRow = {
  description: string;
  darkValue: string;
  lightValue: string;
  token: string;
};

export type DocsShellGuidanceCard = {
  body: string;
  eyebrow: string;
  title: string;
  token: string;
};
