import Link from '@docusaurus/Link';
import type { RouteCard } from './types';

export function RouteCardGrid({ cards }: { cards: readonly RouteCard[] }) {
  return (
    <div className='route-card-grid'>
      {cards.map((card) => {
        return (
          <Link className='route-card' href={card.href} key={card.href}>
            <span className='route-card__label'>{card.label}</span>
            <span className='route-card__body'>{card.body}</span>
          </Link>
        );
      })}
    </div>
  );
}
