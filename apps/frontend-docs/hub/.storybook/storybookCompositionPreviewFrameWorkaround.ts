import type { API } from 'storybook/manager-api';
import { addons } from 'storybook/manager-api';

/**
 * Temporary workaround for a Storybook composition bug still reproducible in Storybook 10.4.0:
 * after hard-refreshing on a composed ref route, Storybook can seed the local
 * `storybook-preview-iframe` with that ref's iframe URL. That creates two ref iframes with the same
 * source URL, which can leave ref addon panels such as Controls empty. Returning to a local hub story
 * then asks the ref runtime to render the local story id, leaving the preview in a broken state.
 * It can also clear initial URL args before the composed ref iframe has applied them, so initial
 * ref args are replayed once through the manager API after the ref story is prepared.
 *
 * Re-check this after Storybook upgrades and remove it once local stories correctly restore the
 * local `/iframe.html` preview after refresh-on-ref navigation without this guard.
 */
const WORKAROUND_ADDON_ID =
  '@hoite-dev/frontend-docs-hub/storybook-composition-preview-frame-workaround';
const MAIN_PREVIEW_IFRAME_ID = 'storybook-preview-iframe';
const IDLE_PREVIEW_IFRAME_HREF = 'iframe.html?id=*&viewMode=story';
const STORYBOOK_CURRENT_STORY_WAS_SET_EVENT = 'currentStoryWasSet';
const STORYBOOK_STORY_PREPARED_EVENT = 'storyPrepared';
const serializedNumberPattern = /^-?[0-9]+(\.[0-9]+)?$/;

const initialSearchParams = new URLSearchParams(window.location.search);
const initialComposedRefArgs = initialSearchParams.get('args');
const initialComposedRefPath = initialSearchParams.get('path');

let pendingInitialComposedRefArgs =
  initialComposedRefArgs && initialComposedRefPath
    ? {
        args: initialComposedRefArgs,
        path: initialComposedRefPath,
      }
    : null;

type StorybookArgType = {
  type?: {
    name?: string;
  };
};

type StorybookPreparedStory = {
  argTypes?: Record<string, StorybookArgType>;
  id: string;
  refId?: string;
};

function toAbsoluteHref(href: string): string {
  return new URL(href, window.location.href).href;
}

function getIframeHref(iframe: HTMLIFrameElement): string {
  const src = iframe.getAttribute('src') ?? iframe.src;

  return toAbsoluteHref(src);
}

function getCurrentPathParam(): string | null {
  return new URLSearchParams(window.location.search).get('path');
}

function isComposedRefPreviewFrame(api: API, iframe: HTMLIFrameElement): boolean {
  const iframeHref = getIframeHref(iframe);

  return Object.values(api.getRefs()).some((ref) => {
    const refPreviewHref = toAbsoluteHref(`${ref.url.replace(/\/?$/, '/')}iframe.html`);

    return iframeHref.startsWith(refPreviewHref);
  });
}

function getActiveRefId(api: API): string | null {
  const path = getCurrentPathParam();

  if (path) {
    const urlRefId = Object.keys(api.getRefs()).find((refId) => {
      return path.startsWith(`/docs/${refId}_`) || path.startsWith(`/story/${refId}_`);
    });

    if (urlRefId) {
      return urlRefId;
    }
  }

  const { storyId } = api.getUrlState();

  if (!storyId) {
    return null;
  }

  return (
    Object.keys(api.getRefs()).find((refId) => {
      return storyId.startsWith(`${refId}_`);
    }) ?? null
  );
}

function getInitialComposedRefArgsForCurrentPath(): string | null {
  const currentPath = getCurrentPathParam();

  if (!pendingInitialComposedRefArgs || currentPath !== pendingInitialComposedRefArgs.path) {
    return null;
  }

  return pendingInitialComposedRefArgs.args;
}

function deserializeStorybookUrlArgValue(value: string): unknown {
  if (value === '!undefined') {
    return undefined;
  }

  if (value === '!null') {
    return null;
  }

  if (value === '!true') {
    return true;
  }

  if (value === '!false') {
    return false;
  }

  if (serializedNumberPattern.test(value)) {
    return Number(value);
  }

  return value;
}

function coerceStorybookUrlArgValue(
  value: unknown,
  argType: StorybookArgType | undefined,
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (argType?.type?.name === 'string') {
    return String(value);
  }

  if (argType?.type?.name === 'number') {
    return Number(value);
  }

  if (argType?.type?.name === 'boolean') {
    return value === true || String(value) === 'true';
  }

  return value;
}

function parseStorybookUrlArgs(
  serializedArgs: string,
  argTypes: Record<string, StorybookArgType>,
): Record<string, unknown> {
  return serializedArgs.split(';').reduce<Record<string, unknown>>((args, pair) => {
    const separatorIndex = pair.indexOf(':');

    if (separatorIndex <= 0) {
      return args;
    }

    const name = pair.slice(0, separatorIndex);
    const rawValue = pair.slice(separatorIndex + 1);
    const value = deserializeStorybookUrlArgValue(rawValue);

    args[name] = coerceStorybookUrlArgValue(value, argTypes[name]);
    return args;
  }, {});
}

function reconcileInitialComposedRefArgs(api: API): void {
  const activeRefId = getActiveRefId(api);

  if (activeRefId === null) {
    return;
  }

  const args = getInitialComposedRefArgsForCurrentPath();

  if (!args) {
    return;
  }

  const currentStory = api.getCurrentStoryData() as StorybookPreparedStory | undefined;

  if (!currentStory || currentStory.refId !== activeRefId || !currentStory.argTypes) {
    return;
  }

  api.updateStoryArgs(
    currentStory as Parameters<API['updateStoryArgs']>[0],
    parseStorybookUrlArgs(args, currentStory.argTypes),
  );
  pendingInitialComposedRefArgs = null;
}

function setPreviewIframeHref(iframe: HTMLIFrameElement, href: string): void {
  const nextHref = toAbsoluteHref(href);

  if (getIframeHref(iframe) === nextHref) {
    return;
  }

  iframe.src = nextHref;
}

function reconcileMainPreviewFrameIdentity(api: API): void {
  const previewIframe = document.getElementById(MAIN_PREVIEW_IFRAME_ID);

  if (!(previewIframe instanceof HTMLIFrameElement)) {
    return;
  }

  const { viewMode } = api.getUrlState();
  const activeRefId = getActiveRefId(api);

  if (activeRefId !== null) {
    setPreviewIframeHref(previewIframe, IDLE_PREVIEW_IFRAME_HREF);
    return;
  }

  if (!isComposedRefPreviewFrame(api, previewIframe)) {
    return;
  }

  if (viewMode !== 'docs' && viewMode !== 'story') {
    return;
  }

  const currentStory = api.getCurrentStoryData();

  if (!currentStory) {
    return;
  }

  const { previewHref } = api.getStoryHrefs(currentStory.id, {
    viewMode,
  });

  setPreviewIframeHref(previewIframe, previewHref);
}

function reconcileCompositionPreviewFrames(api: API): void {
  reconcileMainPreviewFrameIdentity(api);
  reconcileInitialComposedRefArgs(api);
}

function createReconciliationScheduler(api: API): () => void {
  let scheduledFrameId: number | null = null;

  return () => {
    if (scheduledFrameId !== null) {
      return;
    }

    scheduledFrameId = window.requestAnimationFrame(() => {
      scheduledFrameId = null;
      reconcileCompositionPreviewFrames(api);
    });
  };
}

function observePreviewFrameChanges(scheduleReconciliation: () => void): void {
  const observer = new MutationObserver(() => {
    scheduleReconciliation();
  });

  observer.observe(document.body, {
    attributeFilter: ['data-is-storybook', 'src'],
    attributes: true,
    childList: true,
    subtree: true,
  });
}

export function registerStorybookCompositionPreviewFrameWorkaround(): void {
  addons.register(WORKAROUND_ADDON_ID, (api) => {
    const scheduleReconciliation = createReconciliationScheduler(api);

    if (document.body) {
      observePreviewFrameChanges(scheduleReconciliation);
    } else {
      window.addEventListener(
        'DOMContentLoaded',
        () => {
          observePreviewFrameChanges(scheduleReconciliation);
        },
        { once: true },
      );
    }

    window.addEventListener('popstate', () => {
      scheduleReconciliation();
    });
    api.on(STORYBOOK_CURRENT_STORY_WAS_SET_EVENT, scheduleReconciliation);
    api.on(STORYBOOK_STORY_PREPARED_EVENT, scheduleReconciliation);

    scheduleReconciliation();
  });
}
