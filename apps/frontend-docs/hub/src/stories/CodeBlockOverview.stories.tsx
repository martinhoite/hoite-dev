import {
  codeBlockDocs,
  codeBlockShikiThemes,
  codeBlockVariants,
  defaultCodeBlockCopiedLabel,
  defaultCodeBlockCopyLabel,
  supportedCodeBlockLanguages,
  supportedCodeBlockThemes,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CodeChipList,
  ContractPage,
  ContractSection,
  ContractSubsection,
  ContractTable,
} from './contractDocs';

const meta: Meta = {
  title: 'Design System/Contracts/Primitives/Static',
};

export default meta;

type Story = StoryObj;

const supportedPassthroughAttributes = [
  'id',
  'title',
  'aria-label',
  'aria-labelledby',
  'data-*',
] as const;

export const CodeBlock: Story = {
  name: 'CodeBlock',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const apiRows = [
      {
        description: codeBlockDocs.argTypeDescriptions.code,
        prop: 'code',
        type: 'string',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.language,
        prop: 'language',
        type: 'CodeBlockLanguage',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.label,
        prop: 'label',
        type: 'string | undefined',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.showCopy,
        prop: 'showCopy',
        type: 'boolean | undefined',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.copyLabel,
        prop: 'copyLabel',
        type: 'string | undefined',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.copiedLabel,
        prop: 'copiedLabel',
        type: 'string | undefined',
      },
      {
        description: codeBlockDocs.argTypeDescriptions.themes,
        prop: 'themes',
        type: 'Partial<CodeBlockThemes> | undefined',
      },
    ];
    const classRows = [
      {
        classOutput: codeBlockVariants(),
        state: 'Default CodeBlock shell',
      },
    ];

    return (
      <ContractPage>
        <ContractSection title='Public API'>
          <ContractTable
            columns={[
              {
                header: 'Prop',
                render: (item) => item.prop,
              },
              {
                header: 'Type',
                render: (item) => item.type,
              },
              {
                breakAll: true,
                header: 'Notes',
                render: (item) => item.description,
              },
            ]}
            getRowKey={(item) => item.prop}
            rows={apiRows}
          />
        </ContractSection>
        <ContractSection title='Supported passthrough attributes'>
          <CodeChipList getItemKey={(item) => item} items={supportedPassthroughAttributes} />
        </ContractSection>
        <ContractSection title='Curated language options'>
          <CodeChipList getItemKey={(item) => item} items={supportedCodeBlockLanguages} />
        </ContractSection>
        <ContractSection title='Header behavior'>
          <ContractSubsection title='Visible label resolution'>
            <ContractTable
              columns={[
                {
                  header: 'Input',
                  render: (item) => item.input,
                },
                {
                  breakAll: true,
                  header: 'Rendered header',
                  render: (item) => item.output,
                },
              ]}
              getRowKey={(item) => item.input}
              rows={[
                {
                  input: 'label + language',
                  output: 'label stays visible; language remains highlight metadata.',
                },
                {
                  input: 'language only',
                  output: 'language becomes the visible header text.',
                },
                {
                  input: 'showCopy',
                  output: 'Copy action stays right-aligned inside the always-visible header row.',
                },
              ]}
            />
          </ContractSubsection>
        </ContractSection>
        <ContractSection title='Shared class contract'>
          <ContractTable
            columns={[
              {
                header: 'State',
                render: (item) => item.state,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.state}
            rows={classRows}
          />
        </ContractSection>
        <ContractSection title='Default copy labels'>
          <CodeChipList
            getItemKey={(item) => item.label}
            getItemValue={(item) => `${item.name}: ${item.label}`}
            items={[
              {
                label: defaultCodeBlockCopyLabel,
                name: 'copyLabel',
              },
              {
                label: defaultCodeBlockCopiedLabel,
                name: 'copiedLabel',
              },
            ]}
          />
        </ContractSection>
        <ContractSection title='Default Shiki themes'>
          <CodeChipList
            getItemKey={(item) => item.name}
            getItemValue={(item) => `${item.name}: ${item.theme}`}
            items={[
              {
                name: 'light',
                theme: codeBlockShikiThemes.light,
              },
              {
                name: 'dark',
                theme: codeBlockShikiThemes.dark,
              },
            ]}
          />
        </ContractSection>
        <ContractSection title='Bundled theme options'>
          <CodeChipList getItemKey={(item) => item} items={supportedCodeBlockThemes} />
        </ContractSection>
      </ContractPage>
    );
  },
};
