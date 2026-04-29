import type { SimplifiedUmbracoLink } from '@hoite-dev/umbraco-client';
import { toUrlString } from '@hoite-dev/umbraco-client';
import GlobalLogo from '@site-nuxt/components/global/GlobalLogo.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { createSourceSection } from '../../../hub/src/utils/sourceLinks';
import { setSiteSettings } from '../siteNuxtStorybookRuntime';

type GlobalLogoStoryArgs = {
  logoLink?: SimplifiedUmbracoLink | null;
  logoSize?: number;
  logoText?: string | null;
};

const defaultLogoLink: SimplifiedUmbracoLink = {
  target: null,
  title: 'Return to frontpage',
  url: toUrlString('/'),
};

const meta: Meta<GlobalLogoStoryArgs> = {
  args: {
    logoLink: defaultLogoLink,
    logoSize: 64,
    logoText: 'Hoite Dev',
  },
  argTypes: {
    logoLink: {
      control: 'object',
    },
    logoSize: {
      control: {
        max: 160,
        min: 24,
        step: 4,
        type: 'number',
      },
    },
    logoText: {
      control: 'text',
    },
  },
  component: GlobalLogo,
  parameters: {
    docs: {
      description: {
        component: createSourceSection([
          {
            label: 'Site Nuxt component',
            path: 'apps/site-nuxt/components/global/GlobalLogo.vue',
          },
          {
            label: 'PoC story',
            path: 'apps/frontend-docs/site-nuxt-components/src/stories/GlobalLogo.stories.ts',
          },
          {
            label: 'PoC docs page',
            path: 'apps/frontend-docs/site-nuxt-components/src/stories/GlobalLogo.mdx',
          },
        ]),
      },
    },
  },
  tags: ['autodocs'],
  title: 'Site Nuxt/Components/GlobalLogo',
};

export default meta;

type Story = StoryObj<GlobalLogoStoryArgs>;

export const Basic: Story = {
  render: (args) => {
    setSiteSettings();

    return {
      components: {
        GlobalLogo,
      },
      setup() {
        return {
          args,
        };
      },
      template: `
        <div class="flex items-center">
          <GlobalLogo
            :logo-link="args.logoLink"
            :logo-size="args.logoSize"
            :logo-text="args.logoText"
          />
        </div>
      `,
    };
  },
};
