import { cva, type VariantProps } from 'class-variance-authority';
import {
  arrowIcon,
  calendarIcon,
  checkIcon,
  chevronIcon,
  clockIcon,
  closeIcon,
  externalLinkIcon,
  homeIcon,
  minusIcon,
  plusIcon,
  searchIcon,
  userIcon,
} from './icons';

export const supportedIconNames = [
  'plus',
  'minus',
  'check',
  'chevron',
  'arrow',
  'external-link',
  'close',
  'search',
  'user',
  'home',
  'calendar',
  'clock',
] as const;
export const supportedIconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const supportedIconVariants = ['primary', 'secondary', 'on-fill', 'disabled'] as const;
export const supportedIconRotations = ['0', '45', '90', '135', '180', '225', '270', '315'] as const;

export type IconName = (typeof supportedIconNames)[number];
export type IconSize = (typeof supportedIconSizes)[number];
export type IconVariant = (typeof supportedIconVariants)[number];
export type IconRotation = (typeof supportedIconRotations)[number];

export type IconDefinition = {
  name: IconName;
  viewBox: string;
  paths: readonly string[];
};

export const iconDefinitions = {
  arrow: arrowIcon,
  calendar: calendarIcon,
  check: checkIcon,
  chevron: chevronIcon,
  clock: clockIcon,
  close: closeIcon,
  'external-link': externalLinkIcon,
  home: homeIcon,
  minus: minusIcon,
  plus: plusIcon,
  search: searchIcon,
  user: userIcon,
} satisfies Record<IconName, IconDefinition>;

export const iconVariants = cva('icon', {
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
  variants: {
    rotation: {
      '0': '',
      '45': 'icon--rotate-45',
      '90': 'icon--rotate-90',
      '135': 'icon--rotate-135',
      '180': 'icon--rotate-180',
      '225': 'icon--rotate-225',
      '270': 'icon--rotate-270',
      '315': 'icon--rotate-315',
    },
    size: {
      xs: 'icon--xs',
      sm: 'icon--sm',
      md: 'icon--md',
      lg: 'icon--lg',
      xl: 'icon--xl',
    },
    variant: {
      primary: 'icon--primary',
      secondary: 'icon--secondary',
      'on-fill': 'icon--on-fill',
      disabled: 'icon--disabled',
    },
  },
});

export type IconVariantProps = VariantProps<typeof iconVariants>;

export function resolveIconDefinition(name: IconName): IconDefinition {
  return iconDefinitions[name];
}
