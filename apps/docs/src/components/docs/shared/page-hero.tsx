import Link from '@docusaurus/Link';
import { TokenCode } from './presentation';
import type { DocsHeroAction, DocsHeroMetric, DocsHeroPanel } from './types';
import { useResolvedCssValues } from './use-resolved-css-values';

export function DocsPageHero({
  actions,
  eyebrow,
  meta,
  metrics,
  panels,
  summary,
  title,
}: {
  actions: readonly DocsHeroAction[];
  eyebrow: string;
  meta?: string;
  metrics: readonly DocsHeroMetric[];
  panels: readonly DocsHeroPanel[];
  summary: string;
  title: string;
}) {
  const resolvedValues = useResolvedCssValues(metrics.map((metric) => metric.token));

  return (
    <section className='docs-hero-surface'>
      <div className='docs-hero-grid'>
        <div className='docs-hero-copy'>
          <p className='docs-eyebrow'>{eyebrow}</p>
          <div className='docs-hero-metrics'>
            {metrics.map((metric) => {
              const resolvedValue = resolvedValues[metric.token] || `var(${metric.token})`;

              return (
                <span className='docs-hero-metric' key={metric.token}>
                  <span className='docs-hero-metric__label'>{metric.label}</span>
                  <TokenCode>{resolvedValue}</TokenCode>
                </span>
              );
            })}
          </div>
          <h1 className='docs-display-title'>{title}</h1>
          <p className='docs-display-copy'>{summary}</p>
          <div className='docs-action-row'>
            {actions.map((action) => {
              const tone = action.tone ?? 'secondary';

              return (
                <Link className={`docs-cta docs-cta--${tone}`} href={action.href} key={action.href}>
                  {action.label}
                </Link>
              );
            })}
          </div>
          {meta ? <p className='docs-hero-meta'>{meta}</p> : null}
        </div>
        <div className='docs-hero-panel-stack'>
          {panels.map((panel) => {
            const tone = panel.tone ?? 'neutral';

            return (
              <article className={`docs-hero-panel docs-hero-panel--${tone}`} key={panel.label}>
                <p className='docs-hero-panel__label'>{panel.label}</p>
                <p className='docs-hero-panel__body'>{panel.body}</p>
                {panel.href ? (
                  <Link className='docs-inline-link' href={panel.href}>
                    {panel.linkLabel ?? 'Open reference'}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
