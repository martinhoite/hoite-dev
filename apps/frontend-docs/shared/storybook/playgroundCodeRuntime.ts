export type FrontendDocsPlaygroundCodeVisibility = 'hide' | 'show';

export const frontendDocsPlaygroundCodeAttribute = 'data-playground-code';
export const frontendDocsPlaygroundCodeChannelEvent = 'frontend-docs/playground-code-selected';
export const frontendDocsPlaygroundCodeDefaultVisibility = 'show';
export const frontendDocsPlaygroundCodeStorageKey = 'hoite-dev:frontend-docs:playground-code';
export const frontendDocsPlaygroundCodeWindowMessageType =
  'hoite-dev:frontend-docs:playground-code';

const storybookPreviewWrapperId = 'storybook-preview-wrapper';
const storybookPreviewIframeId = 'storybook-preview-iframe';
const storybookRefIframeIdPrefix = 'storybook-ref-';

type StorybookChannel = {
  emit?(eventName: string, event: unknown): void;
  on?(eventName: string, handler: (event: unknown) => void): void;
};

function isPlaygroundCodeVisibility(value: unknown): value is FrontendDocsPlaygroundCodeVisibility {
  return value === 'hide' || value === 'show';
}

export function readFrontendDocsPlaygroundCodeVisibility(): FrontendDocsPlaygroundCodeVisibility {
  try {
    const storedValue = window.localStorage.getItem(frontendDocsPlaygroundCodeStorageKey);

    if (isPlaygroundCodeVisibility(storedValue)) {
      return storedValue;
    }
  } catch {
    return frontendDocsPlaygroundCodeDefaultVisibility;
  }

  return frontendDocsPlaygroundCodeDefaultVisibility;
}

export function writeFrontendDocsPlaygroundCodeVisibility(
  visibility: FrontendDocsPlaygroundCodeVisibility,
): void {
  try {
    window.localStorage.setItem(frontendDocsPlaygroundCodeStorageKey, visibility);
  } catch {
    return;
  }
}

export function applyFrontendDocsPlaygroundCodeVisibilityToDocument(
  visibility: FrontendDocsPlaygroundCodeVisibility,
  targetDocument: Document = document,
): void {
  targetDocument.documentElement.setAttribute(frontendDocsPlaygroundCodeAttribute, visibility);
}

function getStorybookPreviewIframes(targetDocument: Document = document): HTMLIFrameElement[] {
  const previewWrapper = targetDocument.getElementById(storybookPreviewWrapperId);
  const searchRoot = previewWrapper ?? targetDocument;

  return Array.from(
    searchRoot.querySelectorAll<HTMLIFrameElement>(
      `#${storybookPreviewIframeId}, iframe[id^="${storybookRefIframeIdPrefix}"]`,
    ),
  );
}

function applyVisibilityToIframeDocument(
  iframe: HTMLIFrameElement,
  visibility: FrontendDocsPlaygroundCodeVisibility,
): void {
  try {
    const previewDocument = iframe.contentDocument;

    if (previewDocument !== null) {
      applyFrontendDocsPlaygroundCodeVisibilityToDocument(visibility, previewDocument);
    }
  } catch {
    return;
  }
}

function postVisibilityToIframe(
  iframe: HTMLIFrameElement,
  visibility: FrontendDocsPlaygroundCodeVisibility,
): void {
  iframe.contentWindow?.postMessage(
    {
      type: frontendDocsPlaygroundCodeWindowMessageType,
      visibility,
    },
    '*',
  );
}

export function applyFrontendDocsPlaygroundCodeVisibilityToPreviewIframes(
  visibility: FrontendDocsPlaygroundCodeVisibility,
): void {
  for (const iframe of getStorybookPreviewIframes()) {
    applyVisibilityToIframeDocument(iframe, visibility);
    postVisibilityToIframe(iframe, visibility);
  }
}

export function emitFrontendDocsPlaygroundCodeVisibility(
  channel: StorybookChannel,
  visibility: FrontendDocsPlaygroundCodeVisibility,
): void {
  channel.emit?.(frontendDocsPlaygroundCodeChannelEvent, {
    visibility,
  });
}

function readVisibilityFromEvent(event: unknown): FrontendDocsPlaygroundCodeVisibility | null {
  if (typeof event !== 'object' || event === null || Array.isArray(event)) {
    return null;
  }

  const visibility = (event as { visibility?: unknown }).visibility;

  if (isPlaygroundCodeVisibility(visibility)) {
    return visibility;
  }

  return null;
}

export function setupFrontendDocsPlaygroundCodePreview(channel: StorybookChannel): void {
  applyFrontendDocsPlaygroundCodeVisibilityToDocument(readFrontendDocsPlaygroundCodeVisibility());

  window.addEventListener('storage', (event) => {
    if (event.key !== frontendDocsPlaygroundCodeStorageKey) {
      return;
    }

    applyFrontendDocsPlaygroundCodeVisibilityToDocument(readFrontendDocsPlaygroundCodeVisibility());
  });

  window.addEventListener('message', (event) => {
    if (
      typeof event.data !== 'object' ||
      event.data === null ||
      Array.isArray(event.data) ||
      event.data.type !== frontendDocsPlaygroundCodeWindowMessageType
    ) {
      return;
    }

    const visibility = readVisibilityFromEvent(event.data);

    if (visibility === null) {
      return;
    }

    applyFrontendDocsPlaygroundCodeVisibilityToDocument(visibility);
  });

  channel.on?.(frontendDocsPlaygroundCodeChannelEvent, (event) => {
    const visibility = readVisibilityFromEvent(event);

    if (visibility === null) {
      return;
    }

    applyFrontendDocsPlaygroundCodeVisibilityToDocument(visibility);
  });
}
