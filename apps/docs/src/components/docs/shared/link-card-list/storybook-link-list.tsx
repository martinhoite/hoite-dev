import Link from '@docusaurus/Link';
import { DocSectionHeading } from '../section-headings';
import type { StorybookLink } from '../types';
import styles from './link-card-list.module.css';

export function StorybookLinkList({ links }: { links: readonly StorybookLink[] }) {
  return (
    <div className={`${styles.gridBase} ${styles.storyGrid}`}>
      {links.map((link) => {
        return (
          <article className={`${styles.card} ${styles.ctaCard}`} key={link.href}>
            <span className={styles.label}>{link.label}</span>
            <span className={styles.body}>{link.summary}</span>
            <Link className='docs-cta docs-cta--primary' href={link.href}>
              Open {link.label}
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function StorybookLinksSection({
  heading,
  intro,
  links,
}: {
  heading: string;
  intro?: string;
  links: readonly StorybookLink[];
}) {
  return (
    <section className='docs-surface docs-surface--stackable'>
      <DocSectionHeading>{heading}</DocSectionHeading>
      {intro ? <p className='docs-surface__intro'>{intro}</p> : null}
      <StorybookLinkList links={links} />
    </section>
  );
}
