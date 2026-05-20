<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type LinkAppearance,
  type LinkRel,
  type LinkTarget,
  linkVariants,
  resolveLinkRel,
} from '@hoite-dev/ui';
import { Comment, computed, defineComponent, type PropType, Text, watchEffect } from 'vue';

type LinkBaseProps = {
  appearance?: LinkAppearance;
  href: string;
  rel?: LinkRel;
  target?: LinkTarget;
};

export type LinkProps = LinkBaseProps;

function pickAnchorAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) =>
        key !== 'class' && key !== 'style' && key !== 'href' && key !== 'rel' && key !== 'target',
    ),
  );
}

const linkRelPropType = [String, Array] as unknown as PropType<LinkRel>;

export default defineComponent({
  inheritAttrs: false,
  props: {
    appearance: {
      required: false,
      type: String as PropType<LinkAppearance>,
    },
    href: {
      required: true,
      type: String,
    },
    rel: {
      required: false,
      type: linkRelPropType,
    },
    target: {
      required: false,
      type: String as PropType<LinkTarget>,
    },
  },
  setup(props: Readonly<LinkBaseProps>, { attrs, slots }) {
    const restAttrs = computed(() => pickAnchorAttributes(attrs));
    const className = computed(() =>
      linkVariants({
        appearance: props.appearance,
        class: attrs.class,
      }),
    );
    const resolvedRel = computed(() => resolveLinkRel(props.target, props.rel));
    const hasVisibleContent = computed(() => {
      const slotNodes = slots.default?.() ?? [];

      return slotNodes.some((node) => {
        if (node.type === Comment) {
          return false;
        }

        if (node.type === Text && typeof node.children === 'string') {
          return node.children.trim().length > 0;
        }

        return true;
      });
    });

    watchEffect(() => {
      if (hasVisibleContent.value) {
        return;
      }

      warnInDevelopment('[Link] Visible link text is missing. Use Link with visible content.');
    });

    return {
      className,
      hasVisibleContent,
      restAttrs,
      resolvedRel,
    };
  },
});
</script>

<template>
  <a
    v-bind="restAttrs"
    :class="className"
    :href="href"
    :rel="resolvedRel"
    :style="$attrs.style"
    :target="target"
  >
    <slot></slot>
  </a>
</template>
