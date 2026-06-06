import Link from '@docusaurus/Link';
import type { RouteCard } from '../types';
import styles from './link-card-list.module.css';

export function RouteCardGrid({ cards }: { cards: readonly RouteCard[] }) {
  return (
    <div className={`${styles.gridBase} ${styles.routeGrid}`}>
      {cards.map((card) => {
        return (
          <Link className={styles.card} href={card.href} key={card.href}>
            <span className={styles.label}>{card.label}</span>
            <span className={styles.body}>{card.body}</span>
          </Link>
        );
      })}
    </div>
  );
}
