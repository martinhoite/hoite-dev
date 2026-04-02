import ViteYaml from '@modyfi/vite-plugin-yaml';

import alias from './alias';

const LOCAL_APP_HOST = 'site-nuxt.local.hoite.dev';
const LOCAL_CERTIFICATE_HOST = 'local.hoite.dev';
const LOCAL_SITE_ORIGIN = `https://${LOCAL_APP_HOST}:3000`;

// https://nuxt.com/docs/4.x/api/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    umbracoBaseUrl: '',
    umbracoDeliveryApiKey: '',
    umbracoExcludedDocTypes: '',
    umbracoStartItem: '',
    public: {
      environment: '',
      mediaBase: '',
      fallbackLocale: '',
      siteBaseUrl: LOCAL_SITE_ORIGIN,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: false,
    layoutTransition: false,
    rootAttrs: {
      id: '__app',
    },
  },

  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', ['defineStore', 'definePiniaStore']],
      },
    ],
    '@nuxt/image',
    'nuxt-schema-org',
  ],

  image: {
    inject: true,
    providers: {
      customProvider: {
        provider: '~/providers/imageSharp',
      },
    },
    screens: {
      mobile: 320,
      tablet: 576,
      laptop: 1024,
      smallDesktop: 1280,
      desktop: 1536,
    },
  },

  components: ['~/components', '~/components/base'],

  css: ['~/assets/css/app.css'],

  postcss: {
    plugins: {
      'postcss-nested': {},
      '@csstools/postcss-global-data': {
        files: ['assets/css/_variables.css', 'assets/css/_mediaqueries.css'],
      },
      'postcss-preset-env': {
        preserve: true,
        features: {
          'color-function': { unresolved: 'warn' },
          'custom-media-queries': true,
          'custom-properties': {
            disableDeprecationNotice: false,
          },
        },
        browsers: ['>= 2% in DK'],
      },
      'postcss-custom-media': {},
      'postcss-calc': {},
      'postcss-reporter': {
        clearReportedMessages: true,
      },
    },
  },

  vite: {
    plugins: [ViteYaml()],
    server: {
      allowedHosts: [LOCAL_APP_HOST],
    },
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },

  build: {
    transpile: ['@hoite-dev/umbraco-client'],
  },

  imports: {
    dirs: ['stores', 'types/*.ts', 'types/**/*.ts'],
  },

  typescript: {
    strict: true,
    sharedTsConfig: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        types: ['@modyfi/vite-plugin-yaml/modules'],
      },
    },
  },

  alias: {
    ...alias,
  },

  devtools: {
    enabled: true,
  },

  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    externals: {
      inline: ['@hoite-dev/umbraco-client'],
    },
    minify: true,
  },

  sourcemap: {
    client: true,
  },

  devServer: {
    port: 3000,
    host: LOCAL_APP_HOST,
    https: {
      key: `./ssl/${LOCAL_CERTIFICATE_HOST}-key.pem`,
      cert: `./ssl/${LOCAL_CERTIFICATE_HOST}.pem`,
    },
  },

  compatibilityDate: '2026-03-29',
});
