import Link from '@docusaurus/Link';
import { DocSectionHeading } from './section-headings';
import type { StorybookLink } from './types';

export function StorybookLinkList({
  heading,
  links,
}: {
  heading: string;
  links: readonly StorybookLink[];
}) {
  return (
    <section className='docs-surface docs-surface--stackable'>
      <DocSectionHeading>{heading}</DocSectionHeading>
      <div className='story-link-list'>
        {links.map((link) => {
          return (
            <Link className='story-link' href={link.href} key={link.href}>
              <span className='story-link__label'>{link.label}</span>
              <span className='story-link__summary'>{link.summary}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
