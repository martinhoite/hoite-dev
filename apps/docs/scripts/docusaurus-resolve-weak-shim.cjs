const Module = require('node:module');

if (typeof Function.prototype.resolveWeak !== 'function') {
  Object.defineProperty(Function.prototype, 'resolveWeak', {
    configurable: true,
    value: function resolveWeakShim(...args) {
      void args;

      return undefined;
    },
    writable: true,
  });
}

if (typeof require.extensions['.css'] !== 'function') {
  require.extensions['.css'] = () => {};
}

const realModuleLoad = Module._load;

Module._load = function loadWithDocusaurusShims(request, parent, isMain) {
  if (
    typeof request === 'string' &&
    request.includes('@docusaurus\\theme-classic') &&
    (request.endsWith('\\lib\\prism-include-languages') || request.endsWith('\\lib\\nprogress'))
  ) {
    return {};
  }

  return realModuleLoad.call(this, request, parent, isMain);
};
