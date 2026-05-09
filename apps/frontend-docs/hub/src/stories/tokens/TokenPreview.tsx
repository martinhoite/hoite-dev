import React from 'react';

void React;

import { parseDurationMs, parseLengthPx, parseNumber } from './tokenFormat';
import type { TokenCategoryRow } from './tokenModel';

type TokenPreviewProps = {
  cssValue: string;
  prefersReducedMotion: boolean;
  row: TokenCategoryRow;
};

const previewBorderColor = 'var(--color-border-strong)';

function MotionSweepPreview({
  animation,
  shouldAnimate,
}: {
  animation: string;
  shouldAnimate: boolean;
}) {
  return (
    <div
      className='relative h-3 w-28 overflow-hidden rounded-[var(--radius-xs)] border bg-[var(--color-bg-subtle)]'
      style={{ borderColor: previewBorderColor }}
    >
      <span
        className='absolute inset-y-0 left-0 block origin-left opacity-90'
        style={{
          animation: shouldAnimate ? animation : 'none',
          backgroundColor: 'var(--color-bg-brand)',
          transform: shouldAnimate ? undefined : 'scaleX(1)',
          width: '100%',
        }}
      />
    </div>
  );
}

function renderMotionDurationPreview(cssValue: string, prefersReducedMotion: boolean) {
  const durationMs = Math.max(parseDurationMs(cssValue) ?? 0, 0);
  const shouldAnimate = !prefersReducedMotion && durationMs > 0;

  return (
    <MotionSweepPreview
      animation={`hoite-token-motion-sweep ${durationMs}ms var(--motion-easing-standard) infinite alternate`}
      shouldAnimate={shouldAnimate}
    />
  );
}

function renderMotionEasingPreview(cssValue: string, prefersReducedMotion: boolean) {
  const shouldAnimate = !prefersReducedMotion;

  return (
    <MotionSweepPreview
      animation={`hoite-token-motion-sweep var(--motion-duration-slow, 240ms) ${cssValue} infinite alternate`}
      shouldAnimate={shouldAnimate}
    />
  );
}

function renderLayoutGridColumnsPreview(cssValue: string) {
  const columns = Math.max(1, Math.min(parseNumber(cssValue) ?? 4, 12));

  return (
    <div
      className='grid h-7 w-28 gap-1 rounded-[var(--radius-xs)] border p-1'
      style={{
        borderColor: previewBorderColor,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: columns }, (_, index) => {
        const columnNumber = index + 1;

        return (
          <span
            className='rounded-[1px] border'
            key={`layout-column-${columnNumber}`}
            style={{
              backgroundColor:
                columnNumber % 2 === 1
                  ? 'var(--color-bg-brand-subtle)'
                  : 'color-mix(in srgb, var(--color-bg-brand-subtle) 55%, var(--color-bg-surface) 45%)',
              borderColor: 'var(--color-border-default)',
            }}
          />
        );
      })}
    </div>
  );
}

function renderLayoutGutterPreview(cssValue: string) {
  const gutterPx = Math.max(parseLengthPx(cssValue) ?? 16, 2);
  const gutterForPreview = Math.min(gutterPx, 48);

  return (
    <div
      className='w-28 rounded-[var(--radius-xs)] border bg-[var(--color-bg-subtle)]'
      style={{
        borderColor: previewBorderColor,
        paddingLeft: `${gutterForPreview}px`,
        paddingRight: `${gutterForPreview}px`,
      }}
    >
      <div
        className='flex h-4 items-center justify-center rounded-[2px] border text-[9px] font-semibold uppercase tracking-[0.04em]'
        style={{
          backgroundColor: 'var(--color-bg-brand-subtle)',
          borderColor: 'var(--color-border-default)',
          color: 'var(--color-text-brand)',
        }}
      >
        Content
      </div>
    </div>
  );
}

function renderLayoutContainerPreview(cssValue: string) {
  const width = Math.min(Math.max(parseLengthPx(cssValue) ?? 640, 240), 1280);
  const widthPct = Math.round((width / 1280) * 100);

  return (
    <div
      className='flex h-5 w-28 items-center rounded-[var(--radius-xs)] border bg-[var(--color-bg-subtle)] px-1'
      style={{ borderColor: previewBorderColor }}
    >
      <div
        className='h-2 rounded-[2px]'
        style={{
          backgroundColor: 'var(--color-bg-brand)',
          opacity: 0.75,
          width: `${Math.max(20, Math.min(widthPct, 100))}%`,
        }}
      />
    </div>
  );
}

function renderStrokePreview(row: TokenCategoryRow, cssValue: string) {
  const focusStrokeTokens = ['focus-ring', 'stroke-highlight'];
  const usesFocusStrokeColor = focusStrokeTokens.some((tokenName) =>
    row.cssVarName.includes(tokenName),
  );
  const stroke = parseNumber(cssValue) ?? 1;
  const strokeColor = usesFocusStrokeColor
    ? 'var(--color-border-focus)'
    : 'var(--color-border-default)';

  return (
    <div
      className='flex h-4 w-14 items-center rounded-[var(--radius-xs)] bg-[var(--color-bg-subtle)] px-1'
      style={{ border: `${Math.max(1, Math.min(stroke, 12))}px solid ${strokeColor}` }}
    />
  );
}

function renderSpacingPreview(cssValue: string) {
  const size = parseLengthPx(cssValue) ?? 16;
  const clampedSize = Math.min(Math.max(size, 1), 56);

  return (
    <div
      className='rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
      style={{
        backgroundColor: 'var(--color-bg-brand-subtle)',
        borderColor: previewBorderColor,
        height: `${clampedSize}px`,
        width: `${clampedSize}px`,
      }}
    />
  );
}

function renderSizePreview(cssValue: string) {
  const size = parseLengthPx(cssValue) ?? 16;
  const clampedSize = Math.min(Math.max(size, 8), 56);

  return (
    <div
      className='rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
      style={{
        backgroundColor: 'var(--color-bg-brand-subtle)',
        borderColor: previewBorderColor,
        height: `${clampedSize}px`,
        width: `${clampedSize}px`,
      }}
    />
  );
}

export function TokenPreview({ cssValue, prefersReducedMotion, row }: TokenPreviewProps) {
  switch (row.previewKind) {
    case 'color':
      return (
        <span
          className='inline-block h-5 w-11 rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
          style={{ backgroundColor: `var(${row.cssVarName})` }}
          title={cssValue || row.value}
        />
      );

    case 'motion-duration':
      return renderMotionDurationPreview(cssValue, prefersReducedMotion);

    case 'motion-easing':
      return renderMotionEasingPreview(cssValue, prefersReducedMotion);

    case 'layout-grid-columns':
      return renderLayoutGridColumnsPreview(cssValue);

    case 'layout-gutter':
      return renderLayoutGutterPreview(cssValue);

    case 'layout-container':
      return renderLayoutContainerPreview(cssValue);

    case 'typography-weight':
      return (
        <span className='text-sm text-[var(--color-text-primary)]' style={{ fontWeight: cssValue }}>
          Aa
        </span>
      );

    case 'typography-size':
      return (
        <span
          className='text-[var(--color-text-primary)]'
          style={{ fontSize: cssValue, lineHeight: 1 }}
        >
          Aa
        </span>
      );

    case 'typography-letter-spacing':
      return (
        <span
          className='text-sm text-[var(--color-text-primary)]'
          style={{ letterSpacing: cssValue }}
        >
          Lorem ipsum dolor sit amet.
        </span>
      );

    case 'typography-family':
      return (
        <span className='text-sm text-[var(--color-text-primary)]' style={{ fontFamily: cssValue }}>
          The quick brown fox jumps over the fence.
        </span>
      );

    case 'typography-line-height':
      return (
        <span className='text-sm text-[var(--color-text-primary)]' style={{ lineHeight: cssValue }}>
          Ag
        </span>
      );

    case 'typography-paragraph-spacing':
      return (
        <div className='w-20 text-xs text-[var(--color-text-primary)]'>
          <div>Lorem ipsum dolor sit amet.</div>
          <div style={{ marginTop: `var(${row.cssVarName})` }}>Consectetur adipiscing elit.</div>
        </div>
      );

    case 'radius':
      return (
        <span
          className='inline-block h-5 w-8 border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)]'
          style={{ borderColor: previewBorderColor, borderRadius: cssValue }}
        />
      );

    case 'stroke':
      return renderStrokePreview(row, cssValue);

    case 'spacing':
      return renderSpacingPreview(cssValue);

    case 'size':
      return renderSizePreview(cssValue);

    case 'none':
      return <span>-</span>;
  }
}
