import '../src/styles/tailwind.css';
import '../src/styles/siteNuxtPreview.css';
import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '@hoite-dev/ui/typography.css';

import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import { defineComponent, h } from 'vue';

setup((app) => {
  app.component(
    'BaseLink',
    defineComponent({
      name: 'StorybookBaseLink',
      inheritAttrs: false,
      props: {
        link: {
          type: Object,
          default: null,
        },
      },
      setup(props, { attrs, slots }) {
        return () => {
          return h(
            'a',
            {
              ...attrs,
              href: props.link?.url ?? '#',
              target: props.link?.target ?? undefined,
              title: props.link?.title ?? undefined,
            },
            slots.default?.(),
          );
        };
      },
    }),
  );
});

const preview: Preview = {
  decorators: [
    (story) => ({
      components: {
        Story: story(),
      },
      template: '<div class="site-nuxt-storybook-shell theme theme--dark"><Story /></div>',
    }),
  ],
};

export default preview;
