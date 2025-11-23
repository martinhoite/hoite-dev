import ViteYaml from '@modyfi/vite-plugin-yaml';
import alias from './alias';

const LOCAL_DEVELOPMENT_HOST = 'local.hoite.dev';
const LOCAL_CONTENT_HOST = 'martin.hoite.dev';

// https://nuxt.com/docs/4.x/api/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      environment: '',
      apiBase: '',
      mediaBase: '',
      fallbackLocale: '',
      localDevelopmentHost: LOCAL_DEVELOPMENT_HOST,
      localContentHost: LOCAL_CONTENT_HOST
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
    'reka-ui/nuxt'
  ],

  image: {
    inject: true,
    providers: {
      customProvider: {
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
      include: ['reka-ui']
    },
    server: {
      allowedHosts: [LOCAL_DEVELOPMENT_HOST]
    }
  },

  imports: {
    dirs: ['stores', 'types/*.ts', 'types/**/*.ts']
  },

  typescript: {
    strict: true,
    sharedTsConfig: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        types: ['@modyfi/vite-plugin-yaml/modules']
      }
    }
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

  devServer: {
    port: 3000,
    host: LOCAL_DEVELOPMENT_HOST,
    https: {
      key: `./ssl/${LOCAL_DEVELOPMENT_HOST}-key.pem`,
      cert: `./ssl/${LOCAL_DEVELOPMENT_HOST}.pem`
    }
  },

  compatibilityDate: '2025-11-23'
});
