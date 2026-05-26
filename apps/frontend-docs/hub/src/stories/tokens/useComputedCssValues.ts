import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { CssValueMap } from './tokenModel';

/**
 * Reads resolved CSS custom property values from the docs root when possible.
 * Falling back to body/document keeps the first render useful before refs attach.
 */
function readCssValues(varNames: readonly string[], rootElement: HTMLElement | null): CssValueMap {
  if (typeof window === 'undefined') {
    return {};
  }

  const computed = getComputedStyle(rootElement ?? document.body ?? document.documentElement);
  const values: CssValueMap = {};

  for (const varName of varNames) {
    values[varName] = computed.getPropertyValue(varName).trim();
  }

  return values;
}

export function useComputedCssValues(
  varNames: readonly string[],
  rootRef: RefObject<HTMLElement | null>,
): CssValueMap {
  const varNamesRef = useRef(varNames);
  const rootRefInner = useRef(rootRef);
  const [values, setValues] = useState<CssValueMap>(() => {
    return readCssValues(varNames, rootRef.current);
  });

  useEffect(() => {
    varNamesRef.current = varNames;
    rootRefInner.current = rootRef;
    setValues(readCssValues(varNames, rootRef.current));
  }, [varNames, rootRef]);

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') {
      return undefined;
    }

    const root = document.documentElement;
    const body = document.body;
    const observer = new MutationObserver(() => {
      const element = rootRefInner.current.current;
      setValues(readCssValues(varNamesRef.current, element));
    });

    // Storybook and the app shell both express theme changes through attributes
    // on root/body. Re-read computed vars when those attributes change so the
    // tables track light/dark and composed theme switches without a page reload.
    observer.observe(root, {
      attributeFilter: ['class', 'data-color-mode', 'data-theme'],
      attributes: true,
      subtree: true,
    });

    if (body) {
      observer.observe(body, {
        attributeFilter: ['class', 'data-color-mode', 'data-theme'],
        attributes: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return values;
}
