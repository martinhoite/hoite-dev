import React from 'react';

void React;

import { parseDurationMs } from './tokenFormat';
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

function renderLayoutGridColumnsPreview(row: TokenCategoryRow) {
  return (
    <div
      className='grid h-7 w-28 gap-1 rounded-[var(--radius-xs)] border p-1'
      style={{
        borderColor: previewBorderColor,
        gridTemplateColumns: `repeat(var(${row.cssVarName}), minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: 12 }, (_, index) => {
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

function renderLayoutGutterPreview(row: TokenCategoryRow) {
  return (
    <div
      className='w-28 overflow-hidden rounded-[var(--radius-xs)] border bg-[var(--color-bg-subtle)]'
      style={{
        borderColor: previewBorderColor,
        paddingLeft: `var(${row.cssVarName})`,
        paddingRight: `var(${row.cssVarName})`,
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

function renderLayoutContainerPreview(row: TokenCategoryRow) {
  return (
    <div
      className='flex h-5 w-28 items-center overflow-hidden rounded-[var(--radius-xs)] border bg-[var(--color-bg-subtle)] px-1'
      style={{ borderColor: previewBorderColor }}
    >
      <div
        className='h-2 rounded-[2px]'
        style={{
          backgroundColor: 'var(--color-bg-brand)',
          opacity: 0.75,
          width: `var(${row.cssVarName})`,
        }}
      />
    </div>
  );
}

function renderStrokePreview(row: TokenCategoryRow) {
  const focusStrokeTokens = ['focus-ring', 'stroke-highlight'];
  const usesFocusStrokeColor = focusStrokeTokens.some((tokenName) =>
    row.cssVarName.includes(tokenName),
  );
  const strokeColor = usesFocusStrokeColor
    ? 'var(--color-border-focus)'
    : 'var(--color-border-default)';

  return (
    <div
      className='flex h-4 w-14 items-center rounded-[var(--radius-xs)] bg-[var(--color-bg-subtle)] px-1'
      style={{ border: `var(${row.cssVarName}) solid ${strokeColor}` }}
    />
  );
}

function renderSpacingPreview(row: TokenCategoryRow) {
  return (
    <div
      className='rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
      style={{
        backgroundColor: 'var(--color-bg-brand-subtle)',
        borderColor: previewBorderColor,
        height: `var(${row.cssVarName})`,
        width: `var(${row.cssVarName})`,
      }}
    />
  );
}

function renderSizePreview(row: TokenCategoryRow) {
  return (
    <div
      className='rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
      style={{
        backgroundColor: 'var(--color-bg-brand-subtle)',
        borderColor: previewBorderColor,
        height: `var(${row.cssVarName})`,
        width: `var(${row.cssVarName})`,
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
      return renderLayoutGridColumnsPreview(row);

    case 'layout-gutter':
      return renderLayoutGutterPreview(row);

    case 'layout-container':
      return renderLayoutContainerPreview(row);

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
      return renderStrokePreview(row);

    case 'spacing':
      return renderSpacingPreview(row);

    case 'size':
      return renderSizePreview(row);

    case 'none':
      return <span>-</span>;
  }
}
