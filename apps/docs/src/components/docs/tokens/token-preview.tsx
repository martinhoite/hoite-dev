import type { ReactNode } from 'react';
import { formatTokenValue } from './data';
import type { TokenReferenceRow } from './types';

function parseTokenNumber(value: string) {
  const match = /-?\d*\.?\d+/.exec(value);

  if (!match?.[0]) {
    return null;
  }

  return Number(match[0]);
}

function parseLengthPx(value: string) {
  const trimmed = value.trim();
  const match = /^(-?\d*\.?\d+)\s*(px|rem|%)?$/i.exec(trimmed);

  if (!match) {
    return parseTokenNumber(trimmed);
  }

  const numeric = Number(match[1]);
  const unit = (match[2] ?? '').toLowerCase();

  if (unit === 'rem') {
    return numeric * 16;
  }

  return numeric;
}

function parseDurationMs(value: string) {
  const trimmed = value.trim();
  const match = /^(-?\d*\.?\d+)\s*(ms|s)?$/i.exec(trimmed);

  if (!match) {
    return parseTokenNumber(trimmed);
  }

  const numeric = Number(match[1]);
  const unit = (match[2] ?? '').toLowerCase();

  if (unit === 's') {
    return numeric * 1000;
  }

  return numeric;
}

function ColorSwatch({ value }: { value: string }) {
  return <span className='token-swatch' style={{ backgroundColor: value }} title={value} />;
}

function MotionSweepPreview({
  animation,
  shouldAnimate,
}: {
  animation: string;
  shouldAnimate: boolean;
}) {
  return (
    <span className='token-preview token-preview--frame token-preview--motion'>
      <span className='token-preview__motion-track'>
        <span
          className='token-preview__motion-sweep'
          style={{
            animation: shouldAnimate ? animation : 'none',
            transform: shouldAnimate ? undefined : 'scaleX(1)',
          }}
        />
      </span>
    </span>
  );
}

export function TokenPreview({
  prefersReducedMotion = false,
  row,
  value,
}: {
  prefersReducedMotion?: boolean;
  row: TokenReferenceRow;
  value: string;
}) {
  if (row.previewKind === 'color') {
    return <ColorSwatch value={formatTokenValue(row.rawValue)} />;
  }

  if (row.previewKind === 'layout-grid-columns') {
    const columns = Math.max(1, Math.min(parseTokenNumber(value) ?? 4, 12));
    const cells: ReactNode[] = [];

    for (let cellNumber = 1; cellNumber <= columns; cellNumber += 1) {
      cells.push(
        <span className='token-preview__layout-grid-cell' key={`${row.token}-${cellNumber}`} />,
      );
    }

    return (
      <span className='token-preview token-preview--frame token-preview--layout-grid'>
        <span
          className='token-preview__layout-grid'
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {cells}
        </span>
      </span>
    );
  }

  if (row.previewKind === 'layout-gutter') {
    const gutterPx = Math.max(parseLengthPx(value) ?? 16, 2);
    const gutterForPreview = Math.min(gutterPx, 48);

    return (
      <span className='token-preview token-preview--frame token-preview--layout-gutter'>
        <span
          className='token-preview__layout-gutter'
          style={{
            paddingLeft: `${gutterForPreview}px`,
            paddingRight: `${gutterForPreview}px`,
          }}
        >
          <span className='token-preview__layout-gutter-content'>Content</span>
        </span>
      </span>
    );
  }

  if (row.previewKind === 'layout-container') {
    const width = Math.min(Math.max(parseLengthPx(value) ?? 640, 240), 1280);
    const widthPct = Math.round((width / 1280) * 100);

    return (
      <span className='token-preview token-preview--frame token-preview--layout-container'>
        <span
          className='token-preview__layout-container'
          style={{ width: `${Math.max(20, Math.min(widthPct, 100))}%` }}
        />
      </span>
    );
  }

  if (row.previewKind === 'spacing') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__spacing'
          style={{ height: `var(${row.token})`, width: `var(${row.token})` }}
        />
      </span>
    );
  }

  if (row.previewKind === 'radius') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__radius'
          style={{ borderRadius: `var(${row.token})` }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'size') {
    const resolvedSize = parseLengthPx(value) ?? 16;
    const clampedSize = Math.max(12, Math.min(resolvedSize, 48));

    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__size'
          style={{
            height: `${clampedSize}px`,
            width: `${clampedSize}px`,
          }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'stroke') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__stroke'
          style={{ borderWidth: `var(${row.token})` }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'motion-duration') {
    const durationMs = Math.max(parseDurationMs(value) ?? 0, 0);
    const shouldAnimate = !prefersReducedMotion && durationMs > 0;

    return (
      <MotionSweepPreview
        animation={`hoite-docs-motion-sweep ${durationMs}ms var(--motion-easing-standard) infinite alternate`}
        shouldAnimate={shouldAnimate}
      />
    );
  }

  if (row.previewKind === 'motion-easing') {
    return (
      <MotionSweepPreview
        animation={`hoite-docs-motion-sweep var(--motion-duration-slow, 240ms) ${value} infinite alternate`}
        shouldAnimate={!prefersReducedMotion}
      />
    );
  }

  if (row.previewKind === 'typography-size') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-size' style={{ fontSize: `var(${row.token})` }}>
          Aa
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-family') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-family' style={{ fontFamily: `var(${row.token})` }}>
          The quick brown fox jumps over the lazy dog.
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-letter-spacing') {
    return (
      <span className='token-preview token-preview--text'>
        <span
          className='token-preview__type-letter-spacing'
          style={{ letterSpacing: `var(${row.token})` }}
        >
          ALIGN
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-paragraph-spacing') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-paragraph-spacing'>
          <span>Paragraph</span>
          <span
            className='token-preview__type-paragraph-gap'
            style={{ height: `var(${row.token})` }}
          />
          <span>Spacing</span>
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-line-height') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-lines' style={{ lineHeight: `var(${row.token})` }}>
          <span>Ag</span>
          <span>Ag</span>
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-weight') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-weight' style={{ fontWeight: `var(${row.token})` }}>
          Aa
        </span>
      </span>
    );
  }

  return (
    <span className='token-preview token-preview--text'>
      <span className='token-preview__text-value'>{value}</span>
    </span>
  );
}
