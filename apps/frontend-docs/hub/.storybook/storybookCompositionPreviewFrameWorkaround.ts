import type { API } from 'storybook/manager-api';
import { addons } from 'storybook/manager-api';

/**
 * Temporary workaround for a Storybook composition bug still reproducible in Storybook 10.4.0:
 * after hard-refreshing on a composed ref route, Storybook can seed the local
 * `storybook-preview-iframe` with that ref's iframe URL. That creates two ref iframes with the same
 * source URL, which can leave ref addon panels such as Controls empty. Returning to a local hub story
 * then asks the ref runtime to render the local story id, leaving the preview in a broken state.
 *
 * Re-check this after Storybook upgrades and remove it once local stories correctly restore the
 * local `/iframe.html` preview after refresh-on-ref navigation without this guard.
 */
const WORKAROUND_ADDON_ID =
  '@hoite-dev/frontend-docs-hub/storybook-composition-preview-frame-workaround';
const MAIN_PREVIEW_IFRAME_ID = 'storybook-preview-iframe';
const IDLE_PREVIEW_IFRAME_HREF = 'iframe.html?id=*&viewMode=story';

function toAbsoluteHref(href: string): string {
  return new URL(href, window.location.href).href;
}

function getIframeHref(iframe: HTMLIFrameElement): string {
  const src = iframe.getAttribute('src') ?? iframe.src;

  return toAbsoluteHref(src);
}

function isComposedRefPreviewFrame(api: API, iframe: HTMLIFrameElement): boolean {
  const iframeHref = getIframeHref(iframe);

  return Object.values(api.getRefs()).some((ref) => {
    const refPreviewHref = toAbsoluteHref(`${ref.url.replace(/\/?$/, '/')}iframe.html`);

    return iframeHref.startsWith(refPreviewHref);
  });
}

function getActiveRefId(api: API): string | null {
  const path = new URLSearchParams(window.location.search).get('path');

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

function createReconciliationScheduler(api: API): () => void {
  let scheduledFrameId: number | null = null;

  return () => {
    if (scheduledFrameId !== null) {
      return;
    }

    scheduledFrameId = window.requestAnimationFrame(() => {
      scheduledFrameId = null;
      reconcileMainPreviewFrameIdentity(api);
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

    scheduleReconciliation();
  });
}
