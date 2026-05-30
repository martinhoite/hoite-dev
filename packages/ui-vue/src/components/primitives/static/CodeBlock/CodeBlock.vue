<script lang="ts">
import {
  codeBlockVariants,
  createCodeBlockCopyAnnouncement,
  createCodeBlockVisibleLabel,
  highlightCodeBlock,
  pickAriaAndDataAttributes,
  type CodeBlockProps as SharedCodeBlockProps,
} from '@hoite-dev/ui';
import { computed, defineComponent, h, onBeforeUnmount, ref, watch } from 'vue';
import { copyTextToClipboard } from './copyTextToClipboard';

type CodeBlockBaseProps = SharedCodeBlockProps & {
  id?: string;
  title?: string;
};

type CodeBlockNativeAttrs = {
  [Key in `data-${string}`]?: boolean | number | string | undefined;
} & {
  [Key in `aria-${string}`]?: boolean | number | string | undefined;
};

export type CodeBlockProps = CodeBlockBaseProps & CodeBlockNativeAttrs;

export default defineComponent({
  inheritAttrs: false,
  props: {
    code: {
      required: true,
      type: String,
    },
    copiedLabel: {
      required: false,
      type: String,
    },
    copyLabel: {
      required: false,
      type: String,
    },
    id: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    language: {
      required: true,
      type: String,
    },
    showCopy: {
      default: false,
      required: false,
      type: Boolean,
    },
    themes: {
      required: false,
      type: Object,
    },
    title: {
      required: false,
      type: String,
    },
  },
  setup(props: Readonly<CodeBlockProps>, { attrs }) {
    const announcement = ref('');
    const highlightedHtml = ref<string | null>(null);
    const isCopied = ref(false);
    let copyResetTimeout: ReturnType<typeof setTimeout> | undefined;
    let highlightRequestId = 0;
    const visibleLabel = computed(() =>
      createCodeBlockVisibleLabel({
        label: props.label,
        language: props.language,
      }),
    );
    const copyMessages = computed(() =>
      createCodeBlockCopyAnnouncement({
        copiedLabel: props.copiedLabel,
        copyLabel: props.copyLabel,
        visibleLabel: visibleLabel.value,
      }),
    );
    const copyControlLabel = computed(() =>
      isCopied.value ? copyMessages.value.copiedButtonLabel : copyMessages.value.copyButtonLabel,
    );
    const copyControlAriaLabel = computed(() =>
      isCopied.value
        ? copyMessages.value.copiedButtonAriaLabel
        : copyMessages.value.copyButtonAriaLabel,
    );
    const copyButtonClassName = computed(() => ({
      'code-block__copy': true,
      'code-block__copy--copied': isCopied.value,
    }));
    const copyLabelClassName = computed(() => ({
      'code-block__copy-label': true,
      'code-block__copy-label--hidden': isCopied.value,
    }));
    const copiedLabelClassName = computed(() => ({
      'code-block__copy-label': true,
      'code-block__copy-label--hidden': !isCopied.value,
    }));
    const className = computed(() => codeBlockVariants({ class: attrs.class }));
    const restAttrs = computed(() => pickAriaAndDataAttributes(attrs));

    watch(
      [() => props.code, () => props.language, () => props.themes],
      () => {
        const requestId = ++highlightRequestId;

        highlightedHtml.value = null;

        void highlightCodeBlock(props.code, props.language, props.themes).then((result) => {
          if (requestId !== highlightRequestId) {
            return;
          }

          highlightedHtml.value = result.html;
        });
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (copyResetTimeout !== undefined) {
        clearTimeout(copyResetTimeout);
      }
    });

    async function copyCode(): Promise<void> {
      if (copyResetTimeout !== undefined) {
        clearTimeout(copyResetTimeout);
        copyResetTimeout = undefined;
      }

      try {
        const didCopy = await copyTextToClipboard(props.code);

        if (!didCopy) {
          announcement.value = '';
          isCopied.value = false;
          return;
        }

        announcement.value = copyMessages.value.copiedAnnouncement;
        isCopied.value = true;
        copyResetTimeout = setTimeout(() => {
          announcement.value = '';
          isCopied.value = false;
          copyResetTimeout = undefined;
        }, 2000);
      } catch {
        announcement.value = '';
        isCopied.value = false;
      }
    }

    return () => {
      return h(
        'div',
        {
          ...restAttrs.value,
          class: className.value,
          id: props.id,
          title: props.title,
        },
        [
          h('div', { class: 'code-block__header' }, [
            visibleLabel.value ? h('p', { class: 'code-block__label' }, visibleLabel.value) : null,
            props.showCopy
              ? h(
                  'button',
                  {
                    'aria-label': copyControlAriaLabel.value,
                    class: copyButtonClassName.value,
                    onClick: copyCode,
                    type: 'button',
                  },
                  [
                    h(
                      'span',
                      {
                        'aria-hidden': 'true',
                        class: 'code-block__copy-labels',
                      },
                      [
                        h(
                          'span',
                          { class: copyLabelClassName.value },
                          copyMessages.value.copyButtonLabel,
                        ),
                        h(
                          'span',
                          { class: copiedLabelClassName.value },
                          copyMessages.value.copiedButtonLabel,
                        ),
                      ],
                    ),
                    h('span', { class: 'code-block__sr-only' }, copyControlLabel.value),
                  ],
                )
              : null,
          ]),
          h(
            'div',
            highlightedHtml.value === null
              ? {
                  class: 'code-block__body',
                }
              : {
                  class: 'code-block__body',
                  innerHTML: highlightedHtml.value,
                },
            highlightedHtml.value === null
              ? [h('pre', { class: 'code-block__fallback' }, [h('code', null, props.code)])]
              : undefined,
          ),
          h(
            'span',
            {
              'aria-atomic': 'true',
              'aria-live': 'polite',
              class: 'code-block__sr-only',
            },
            announcement.value,
          ),
        ],
      );
    };
  },
});
</script>
