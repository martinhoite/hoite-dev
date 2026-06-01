import { TokenCode } from '../shared/presentation';
import { DocSectionHeading } from '../shared/section-headings';
import { useResolvedCssValues } from '../shared/use-resolved-css-values';
import { docsShellGuidanceCards } from './data';

export function DocsShellGuidanceGrid() {
  const resolvedValues = useResolvedCssValues(docsShellGuidanceCards.map((card) => card.token));

  return (
    <section className='docs-surface'>
      <div className='docs-section-copy'>
        <p className='docs-eyebrow'>Token setup</p>
        <DocSectionHeading>How the docs shell should read from the token system</DocSectionHeading>
        <p className='docs-surface__intro'>
          These are the token decisions that should drive the docs frame before any page-specific
          decoration: layout width, gutters, section rhythm, and surface layering.
        </p>
      </div>
      <div className='docs-guidance-grid'>
        {docsShellGuidanceCards.map((card) => {
          const resolvedValue = resolvedValues[card.token] || `var(${card.token})`;

          return (
            <article className='docs-guidance-card' key={card.token}>
              <p className='docs-guidance-card__eyebrow'>{card.eyebrow}</p>
              <h3 className='docs-guidance-card__title'>{card.title}</h3>
              <p className='docs-guidance-card__body'>{card.body}</p>
              <div className='docs-guidance-card__token'>
                <TokenCode>{card.token}</TokenCode>
                <TokenCode>{resolvedValue}</TokenCode>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
