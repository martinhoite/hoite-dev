import type { SimplifiedUmbracoLink, UrlString } from '@hoite-dev/umbraco-client';
import { reactive } from 'vue';

type StorybookSiteSettings = {
  headerLogo: { url: UrlString } | null;
  headerLogoLink: SimplifiedUmbracoLink | null;
  headerLogoText: string | null;
};

function createDefaultSiteSettings(): StorybookSiteSettings {
  return {
    headerLogo: null,
    headerLogoLink: null,
    headerLogoText: null,
  };
}

const settings = reactive<StorybookSiteSettings>(createDefaultSiteSettings());

export function setSiteSettings(overrides: Partial<StorybookSiteSettings> = {}): void {
  Object.assign(settings, createDefaultSiteSettings(), overrides);
}

export function useSite(): { settings: StorybookSiteSettings } {
  return {
    settings,
  };
}

export function getMediaLink(path: UrlString): string {
  return path;
}
