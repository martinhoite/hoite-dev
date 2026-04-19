import {
  resolveTypographyDefaultTag,
  type TypographyVariant,
  typographyVariants,
} from '@hoite-dev/ui';
import { defineComponent, type HTMLAttributes, h, type PropType, type VNode } from 'vue';

type TypographyTag = keyof HTMLElementTagNameMap;

export type TypographyProps = {
  as?: TypographyTag;
  variant: TypographyVariant;
};

export const Typography = defineComponent({
  name: 'Typography',
  props: {
    as: {
      required: false,
      type: String as PropType<TypographyTag>,
    },
    variant: {
      required: true,
      type: String as PropType<TypographyVariant>,
    },
  },
  setup(props, { attrs, slots }) {
    return (): VNode => {
      const normalizedAttrs = attrs as HTMLAttributes;
      const tagName = props.as ?? resolveTypographyDefaultTag(props.variant);
      const className = typographyVariants({
        class: attrs.class,
        variant: props.variant,
      });

      return h(
        tagName,
        {
          ...normalizedAttrs,
          class: className,
        },
        slots.default?.(),
      );
    };
  },
});
