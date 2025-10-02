import type { Meta, StoryObj } from '@storybook/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion.component'

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '접고 펼칠 수 있는 아코디언 컴포넌트입니다. FAQ, 내비게이션 메뉴 등 많은 정보를 컴팩트하게 표시할 때 사용하며 단일/다중 선택을 지원합니다.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes! This accordion allows multiple items to be open at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How about this one?</AccordionTrigger>
        <AccordionContent>
          This one can also be opened while the first one is open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>And this one too?</AccordionTrigger>
        <AccordionContent>
          Absolutely! All items can be open simultaneously.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const SingleItem: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Single accordion item</AccordionTrigger>
        <AccordionContent>
          This is a simple accordion with just one item to demonstrate the basic functionality.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}


export const RichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Feature Overview</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>This accordion supports rich content in both triggers and content areas.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Smooth animations</li>
              <li>Responsive design</li>
              <li>Built-in accessibility features</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Documentation</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <h5 className="font-semibold">Usage Examples</h5>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Trigger Text</AccordionTrigger>
    <AccordionContent>Content here</AccordionContent>
  </AccordionItem>
</Accordion>`}
            </pre>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}