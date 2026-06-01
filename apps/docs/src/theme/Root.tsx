import type { Props } from '@theme/Root';
import { useEffect } from 'react';

const HASH_SCROLL_RETRY_DELAY_MS = 120;
const HASH_SCROLL_RETRY_LIMIT = 12;

function readCssLengthPx(style: CSSStyleDeclaration, propertyName: string) {
  const rawValue = style.getPropertyValue(propertyName).trim();

  if (!rawValue) {
    return 0;
  }

  if (rawValue.endsWith('rem')) {
    const rootFontSize =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    return Number.parseFloat(rawValue) * rootFontSize;
  }

  return Number.parseFloat(rawValue) || 0;
}

function getHashScrollOffsetPx() {
  const rootStyle = getComputedStyle(document.documentElement);
  const navbarHeight = readCssLengthPx(rootStyle, '--ifm-navbar-height');
  const spacing16 = readCssLengthPx(rootStyle, '--spacing-16');

  return navbarHeight + spacing16;
}

function scrollToHashTargetOnInitialLoad(hash: string) {
  if (!hash) {
    return undefined;
  }

  let cancelled = false;
  let timeoutId: number | undefined;
  const frameIds: number[] = [];

  const tryScroll = (attempt: number) => {
    if (cancelled) {
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) {
      if (attempt >= HASH_SCROLL_RETRY_LIMIT) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        tryScroll(attempt + 1);
      }, HASH_SCROLL_RETRY_DELAY_MS);

      return;
    }

    const outerFrameId = window.requestAnimationFrame(() => {
      const innerFrameId = window.requestAnimationFrame(() => {
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - getHashScrollOffsetPx(),
        );

        window.scrollTo({
          behavior: 'auto',
          top,
        });
      });

      frameIds.push(innerFrameId);
    });

    frameIds.push(outerFrameId);
  };

  tryScroll(0);

  return () => {
    cancelled = true;

    if (typeof timeoutId === 'number') {
      window.clearTimeout(timeoutId);
    }

    for (const frameId of frameIds) {
      window.cancelAnimationFrame(frameId);
    }
  };
}

export default function Root({ children }: Props) {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      return undefined;
    }

    return scrollToHashTargetOnInitialLoad(hash);
  }, []);

  return <>{children}</>;
}
