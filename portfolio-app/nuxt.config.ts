import { defineNuxtConfig } from 'nuxt/config';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import alias from './alias';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {}
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    },
    pageTransition: false,
    layoutTransition: false,
    rootId: '__portfolio'
  },

  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', ['defineStore', 'definePiniaStore']]
      }
    ],
    '@nuxt/image',
    'nuxt-schema-org',
    '@nuxt/eslint',
    'radix-vue/nuxt'
  ],

  image: {
    inject: true,
    providers: {
      customProvider: {
        name: 'imageSharp',
        provider: '~/providers/imageSharp'
      }
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,

      xl: 1280,
      xxl: 1536
    }
  },

  components: ['~/components', '~/components/global'],

  css: ['/assets/css/app.css'],

  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-calc': {},
      'postcss-custom-media': {},
      '@csstools/postcss-global-data': {
        files: ['assets/css/_mediaqueries.css', 'assets/css/_variables.css']
      },
      'postcss-preset-env': {
        preserve: true,
        features: {
          'color-function': { unresolved: 'warn' },
          'custom-media-queries': {},
          'custom-properties': {
            disableDeprecationNotice: false
          }
        },
        browsers: ['>= 2% in DK']
      },
      'postcss-reporter': {
        clearReportedMessages: true
      }
    }
  },

  vite: {
    plugins: [ViteYaml()],
    optimizeDeps: {
      include: ['radix-vue']
    }
  },

  imports: {
    dirs: ['stores', 'types/*.ts', 'types/**/*.ts']
  },

  alias: {
    ...alias
  },

  devtools: {
    enabled: true
  },

  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    minify: true
  },

  sourcemap: {
    client: true
  },

  compatibilityDate: '2024-07-17'
});
