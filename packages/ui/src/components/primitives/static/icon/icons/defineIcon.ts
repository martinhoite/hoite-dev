import type { IconDefinition, IconName } from '../icon';

const defaultIconViewBox = '0 0 24 24';

export function defineIcon(name: IconName, paths: readonly string[]): IconDefinition {
  return {
    name,
    paths,
    viewBox: defaultIconViewBox,
  };
}
