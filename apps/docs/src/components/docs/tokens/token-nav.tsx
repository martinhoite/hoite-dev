import { tokenReferenceNavItems } from './data';

export function TokenCategoryNav() {
  return (
    <section className='docs-surface'>
      <nav aria-label='Token categories' className='token-nav'>
        {tokenReferenceNavItems.map((item) => {
          return (
            <a className='token-nav__link' href={`#token-${item.slug}`} key={item.slug}>
              {item.navLabel}
            </a>
          );
        })}
      </nav>
    </section>
  );
}
