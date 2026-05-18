import {
  circularProgressVariants,
  type LoadingColor,
  type LoadingSize,
  loaderVariants,
  progressVariants,
  supportedLoadingColors,
  supportedLoadingSizes,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CodeChipList,
  ContractPage,
  ContractSection,
  ContractSubsection,
  ContractTable,
} from './contractDocs';

const colorKeys = [...supportedLoadingColors] as LoadingColor[];
const sizeKeys = [...supportedLoadingSizes] as LoadingSize[];

const meta: Meta = {
  title: 'Design System/Contracts/Feedback',
};

export default meta;

type Story = StoryObj;

export const Loading: Story = {
  name: 'Loading',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const sizeRows = sizeKeys.map((size) => {
      return {
        circularClassOutput: circularProgressVariants({ size }),
        loaderClassOutput: loaderVariants({ size }),
        progressClassOutput: progressVariants({ size }),
        size,
      };
    });
    const colorRows = colorKeys.map((color) => {
      return {
        circularClassOutput: circularProgressVariants({ color }),
        color,
        loaderClassOutput: loaderVariants({ color }),
        progressClassOutput: progressVariants({ color }),
      };
    });

    return (
      <ContractPage>
        <ContractSection title='Supported sizes'>
          <CodeChipList
            getItemKey={(item) => item.size}
            getItemValue={(item) => item.size}
            items={sizeRows}
          />
        </ContractSection>
        <ContractSection title='Supported colors'>
          <CodeChipList
            getItemKey={(item) => item.color}
            getItemValue={(item) => item.color}
            items={colorRows}
          />
        </ContractSection>
        <ContractSection bodyClassName='grid gap-4' title='Size contract'>
          <div className='grid gap-4'>
            <ContractSubsection title='Loader'>
              <ContractTable
                columns={[
                  {
                    header: 'Size',
                    render: (item) => item.size,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.loaderClassOutput,
                  },
                ]}
                getRowKey={(item) => `loader-${item.size}`}
                rows={sizeRows}
              />
            </ContractSubsection>
            <ContractSubsection title='Progress'>
              <ContractTable
                columns={[
                  {
                    header: 'Size',
                    render: (item) => item.size,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.progressClassOutput,
                  },
                ]}
                getRowKey={(item) => `progress-${item.size}`}
                rows={sizeRows}
              />
            </ContractSubsection>
            <ContractSubsection title='CircularProgress'>
              <ContractTable
                columns={[
                  {
                    header: 'Size',
                    render: (item) => item.size,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.circularClassOutput,
                  },
                ]}
                getRowKey={(item) => `circular-${item.size}`}
                rows={sizeRows}
              />
            </ContractSubsection>
          </div>
        </ContractSection>
        <ContractSection bodyClassName='grid gap-4' title='Color contract'>
          <div className='grid gap-4'>
            <ContractSubsection title='Loader'>
              <ContractTable
                columns={[
                  {
                    header: 'Color',
                    render: (item) => item.color,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.loaderClassOutput,
                  },
                ]}
                getRowKey={(item) => `loader-${item.color}`}
                rows={colorRows}
              />
            </ContractSubsection>
            <ContractSubsection title='Progress'>
              <ContractTable
                columns={[
                  {
                    header: 'Color',
                    render: (item) => item.color,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.progressClassOutput,
                  },
                ]}
                getRowKey={(item) => `progress-${item.color}`}
                rows={colorRows}
              />
            </ContractSubsection>
            <ContractSubsection title='CircularProgress'>
              <ContractTable
                columns={[
                  {
                    header: 'Color',
                    render: (item) => item.color,
                  },
                  {
                    breakAll: true,
                    header: 'Class output',
                    render: (item) => item.circularClassOutput,
                  },
                ]}
                getRowKey={(item) => `circular-${item.color}`}
                rows={colorRows}
              />
            </ContractSubsection>
          </div>
        </ContractSection>
        <ContractSection title='Behavior contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            <code>Progress</code> supports determinate and indeterminate states. Indeterminate state
            is represented by adding <code>progress--indeterminate</code> to the class output and
            uses a dedicated segment size token for motion and reduced-motion fallback.
          </p>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            <code>CircularProgress</code> is determinate only. If value is omitted, wrappers fall
            back to <code>0</code> and emit a development warning.
          </p>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Fraction value display in <code>CircularProgress</code> adds
            <code> circular-progress__value--fraction </code> to reduce value text size by about
            2px.
          </p>
        </ContractSection>
        <ContractSection title='Key loading tokens'>
          <div className='flex flex-wrap gap-2'>
            <code className='rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1'>
              --size-loading-progress-indeterminate-segment
            </code>
            <code className='rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1'>
              --size-loading-progress-reduced-motion-segment
            </code>
            <code className='rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1'>
              --motion-duration-extended
            </code>
            <code className='rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1'>
              --motion-duration-sustained
            </code>
          </div>
        </ContractSection>
      </ContractPage>
    );
  },
};
