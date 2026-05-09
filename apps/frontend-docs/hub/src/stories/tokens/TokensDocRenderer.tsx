import type { MouseEvent } from 'react';
import React, { useMemo, useRef, useState } from 'react';

void React;

import { ColorTokenTable, TokenCategoryTable } from './TokenTable';
import { createColorRows, createTokenCategories, getAllTokenVarNames } from './tokenModel';
import './tokensDoc.css';
import { useComputedCssValues } from './useComputedCssValues';

function resolveDocsAnchorHref(hash: string): string {
  if (typeof window === 'undefined') {
    return hash;
  }

  const url = new URL(window.location.href);
  url.hash = hash;

  return `${url.pathname}${url.search}${url.hash}`;
}

function handleDocsAnchorClick(event: MouseEvent<HTMLAnchorElement>, hash: string): void {
  event.preventDefault();

  if (typeof window === 'undefined') {
    return;
  }

  const targetId = hash.replace(/^#/, '');
  const targetElement = document.getElementById(targetId);

  if (!targetElement) {
    return;
  }

  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  const url = new URL(window.location.href);
  url.hash = hash;
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export function TokensDocRenderer() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const colorRows = useMemo(() => {
    return createColorRows();
  }, []);
  const initialCategories = useMemo(() => {
    return createTokenCategories();
  }, []);
  const allVarNames = useMemo(() => {
    return getAllTokenVarNames(colorRows, initialCategories);
  }, [colorRows, initialCategories]);
  const cssValues = useComputedCssValues(allVarNames, rootRef);
  const categories = useMemo(() => {
    return createTokenCategories(cssValues);
  }, [cssValues]);
  const navItems = useMemo(() => {
    return [
      { href: '#token-color', label: 'Color' },
      ...categories.map((category) => ({
        href: `#${category.id}`,
        label: category.label,
      })),
    ];
  }, [categories]);

  return (
    <div
      className='hoite-token-doc rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4'
      ref={rootRef}
    >
      <h2 className='m-0 border-b border-[var(--color-border-subtle)] pb-2 text-lg font-semibold'>
        Token Reference
      </h2>
      <p className='m-0 mt-2 text-sm text-[var(--color-text-secondary)]'>
        Generated from @hoite-dev/ui exports. Values are shown as resolved CSS variable values.
      </p>
      <nav aria-label='Token section navigation' className='hoite-token-doc__nav'>
        {navItems.map((item) => {
          return (
            <a
              className='hoite-token-doc__nav-link'
              href={resolveDocsAnchorHref(item.href)}
              key={item.href}
              onClick={(event) => {
                handleDocsAnchorClick(event, item.href);
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <section className='mt-6 scroll-mt-24' id='token-color'>
        <h3 className='hoite-token-doc__section-title px-1 py-1 text-base font-semibold text-[var(--color-text-primary)]'>
          Color (light + dark)
        </h3>
        <ColorTokenTable rows={colorRows} />
      </section>
      {categories.map((category) => {
        return (
          <section className='mt-6 scroll-mt-24' id={category.id} key={category.name}>
            <h3 className='hoite-token-doc__section-title px-1 py-1 text-base font-semibold text-[var(--color-text-primary)]'>
              {category.label}
            </h3>
            {category.name === 'motion' ? (
              <label className='mb-3 mt-2 inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)]'>
                <input
                  checked={prefersReducedMotion}
                  onChange={(event) => {
                    setPrefersReducedMotion(event.target.checked);
                  }}
                  type='checkbox'
                />
                Simulate reduced motion
              </label>
            ) : null}
            {category.groups.map((group) => {
              return (
                <div className='mb-4' key={`${category.name}-${group.name}`}>
                  <TokenCategoryTable
                    cssValues={cssValues}
                    prefersReducedMotion={prefersReducedMotion}
                    rows={group.rows}
                    tokenHeaderLabel={group.tokenHeaderLabel}
                  />
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
