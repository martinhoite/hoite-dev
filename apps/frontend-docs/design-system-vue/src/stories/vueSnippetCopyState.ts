import {
  copyFrontendDocsSnippetToClipboard,
  createFrontendDocsHighlightedSnippetHtml,
} from '@hoite-dev/frontend-docs-shared/storybook';
import type { ComputedRef } from 'vue';
import { computed, ref } from 'vue';

export function createVueSnippetCopyState(snippet: ComputedRef<string>) {
  const copyButtonLabel = ref('Copy code');
  const highlightedSnippet = computed(() =>
    createFrontendDocsHighlightedSnippetHtml(snippet.value),
  );
  const copySnippet = async () => {
    copyButtonLabel.value = 'Copying';
    copyButtonLabel.value = (await copyFrontendDocsSnippetToClipboard(snippet.value))
      ? 'Copied'
      : 'Copy error';
  };

  return {
    copyButtonLabel,
    copySnippet,
    highlightedSnippet,
  };
}
