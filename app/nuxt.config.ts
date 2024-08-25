import { defineNuxtConfig } from 'nuxt/config';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import alias from './alias';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      environment: '',
      apiBase: '',
      mediaBase: '',
      fallbackLocale: '',
      localDevelopmentSubdomain: ''
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    },
    pageTransition: false,
    layoutTransition: false,
    rootAttrs: {
      id: '__app'
    }
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
      mobile: 320,
      tablet: 576,
      laptop: 1024,
      smallDesktop: 1280,
      desktop: 1536
    }
  },

  components: ['~/components', '~/components/base'],

  css: ['/assets/css/app.css'],

  postcss: {
    plugins: {
      'postcss-nested': {},
      '@csstools/postcss-global-data': {
        files: ['assets/css/_variables.css', 'assets/css/_mediaqueries.css']
      },
      'postcss-preset-env': {
        preserve: true,
        features: {
          'color-function': { unresolved: 'warn' },
          'custom-media-queries': true,
          'custom-properties': {
            disableDeprecationNotice: false
          }
        },
        browsers: ['>= 2% in DK']
      },
      'postcss-custom-media': {},
      'postcss-calc': {},
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
