import path from 'path';

export default {
  types: path.resolve(__dirname, './types'),
  components: path.resolve(__dirname, './components'),
  composables: path.resolve(__dirname, './composables'),
  pages: path.resolve(__dirname, './pages'),
  stores: path.resolve(__dirname, './src/stores'),
  utils: path.resolve(__dirname, './utils'),
  pinia: path.resolve(__dirname, './node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs')
};