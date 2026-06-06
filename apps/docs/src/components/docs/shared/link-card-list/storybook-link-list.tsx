import Link from '@docusaurus/Link';
import { DocSectionHeading } from '../section-headings';
import type { StorybookLink } from '../types';
import styles from './link-card-list.module.css';

export function StorybookLinkList({ links }: { links: readonly StorybookLink[] }) {
  return (
    <div className={`${styles.gridBase} ${styles.storyGrid}`}>
      {links.map((link) => {
        return (
          <Link className={styles.card} href={link.href} key={link.href}>
            <span className={styles.label}>{link.label}</span>
            <span className={styles.body}>{link.summary}</span>
          </Link>
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
