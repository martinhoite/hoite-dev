import { createOperationsGenerator, defineProvider } from '@nuxt/image/runtime';
import { joinURL, encodeParam } from 'ufo';

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'format',
    width: 'width',
    height: 'height',
    quality: 'quality',
    mode: 'rmode',
    center: 'rxy',
    background: 'bgcolor',
  },
  joinWith: '&',
  formatter: (key: string | number, val: string | number) => encodeParam(key) + '=' + encodeParam(val),
});

export default defineProvider({
  getImage(src, { modifiers }) {
    const params = operationsGenerator(modifiers) || '';

    return {
      url: joinURL(src + (params ? '?' + params : '')),
    };
  },
});
