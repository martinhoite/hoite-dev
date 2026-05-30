function restoreSelection(selection: Selection | null, ranges: Range[]): void {
  if (selection === null) {
    return;
  }

  selection.removeAllRanges();

  for (const range of ranges) {
    selection.addRange(range);
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText !== undefined) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the selection-based copy path for embedded runtimes.
    }
  }

  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  const selection = window.getSelection();
  const selectionRanges =
    selection === null
      ? []
      : Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index));
  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textArea = document.createElement('textarea');

  textArea.value = text;
  textArea.setAttribute('aria-hidden', 'true');
  textArea.setAttribute('readonly', 'true');
  textArea.style.left = '-9999px';
  textArea.style.opacity = '0';
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  document.body.append(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textArea.remove();
    activeElement?.focus();
    restoreSelection(selection, selectionRanges);
  }
}
