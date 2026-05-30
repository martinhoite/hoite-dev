import {
  codeBlockVariants,
  createCodeBlockCopyAnnouncement,
  createCodeBlockVisibleLabel,
  type DataAttributes,
  highlightCodeBlock,
  type CodeBlockProps as SharedCodeBlockProps,
} from '@hoite-dev/ui';
import type { AriaAttributes, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import { copyTextToClipboard } from './copyTextToClipboard';

type CodeBlockBaseProps = SharedCodeBlockProps & {
  className?: string;
  id?: string;
  title?: string;
} & AriaAttributes &
  DataAttributes;

export type CodeBlockProps = CodeBlockBaseProps;

export function CodeBlock({
  className,
  code,
  copiedLabel,
  copyLabel,
  id,
  label,
  language,
  showCopy = false,
  themes,
  title,
  ...restProps
}: CodeBlockProps): ReactElement {
  const [announcement, setAnnouncement] = useState('');
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visibleLabel = createCodeBlockVisibleLabel({ label, language });
  const {
    copiedAnnouncement,
    copiedButtonAriaLabel,
    copiedButtonLabel,
    copyButtonAriaLabel,
    copyButtonLabel,
  } = createCodeBlockCopyAnnouncement({
    copiedLabel,
    copyLabel,
    visibleLabel,
  });
  const copyControlLabel = isCopied ? copiedButtonLabel : copyButtonLabel;
  const copyControlAriaLabel = isCopied ? copiedButtonAriaLabel : copyButtonAriaLabel;

  useEffect(() => {
    let isActive = true;

    setHighlightedHtml(null);

    void highlightCodeBlock(code, language, themes).then((result) => {
      if (!isActive) {
        return;
      }

      setHighlightedHtml(result.html);
    });

    return () => {
      isActive = false;
    };
  }, [code, language, themes]);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== undefined) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy(): Promise<void> {
    if (copyResetTimeoutRef.current !== undefined) {
      clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = undefined;
    }

    try {
      const didCopy = await copyTextToClipboard(code);

      if (!didCopy) {
        setAnnouncement('');
        setIsCopied(false);
        return;
      }

      setAnnouncement(copiedAnnouncement);
      setIsCopied(true);
      copyResetTimeoutRef.current = setTimeout(() => {
        setAnnouncement('');
        setIsCopied(false);
        copyResetTimeoutRef.current = undefined;
      }, 2000);
    } catch {
      setAnnouncement('');
      setIsCopied(false);
    }
  }

  return (
    <div
      {...restProps}
      className={codeBlockVariants({
        className,
      })}
      id={id}
      title={title}
    >
      <div className='code-block__header'>
        <p className='code-block__label'>{visibleLabel}</p>
        {showCopy ? (
          <button
            aria-label={copyControlAriaLabel}
            className={`code-block__copy${isCopied ? ' code-block__copy--copied' : ''}`}
            onClick={() => {
              void handleCopy();
            }}
            type='button'
          >
            <span aria-hidden='true' className='code-block__copy-labels'>
              <span
                className={`code-block__copy-label${isCopied ? ' code-block__copy-label--hidden' : ''}`}
              >
                {copyButtonLabel}
              </span>
              <span
                className={`code-block__copy-label${isCopied ? '' : ' code-block__copy-label--hidden'}`}
              >
                {copiedButtonLabel}
              </span>
            </span>
            <span className='code-block__sr-only'>{copyControlLabel}</span>
          </button>
        ) : null}
      </div>
      {highlightedHtml === null ? (
        <div className='code-block__body'>
          <pre className='code-block__fallback'>
            <code>{code}</code>
          </pre>
        </div>
      ) : (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates the highlighted markup from the raw code string.
        <div className='code-block__body' dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      )}
      <span aria-atomic='true' aria-live='polite' className='code-block__sr-only'>
        {announcement}
      </span>
    </div>
  );
}
