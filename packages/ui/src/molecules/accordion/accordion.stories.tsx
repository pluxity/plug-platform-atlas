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
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'separated', 'card', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
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

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-2xl">
      <div>
        <h4 className="text-sm font-medium mb-3">Default</h4>
        <Accordion type="single" collapsible variant="default">
          <AccordionItem value="item-1">
            <AccordionTrigger>Default variant</AccordionTrigger>
            <AccordionContent>
              This is the default accordion variant with simple borders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              Content for the second accordion item in default style.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Bordered</h4>
        <Accordion type="single" collapsible variant="bordered">
          <AccordionItem value="item-1">
            <AccordionTrigger>Bordered variant</AccordionTrigger>
            <AccordionContent>
              This accordion has a complete border around all items.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              Content for the second accordion item in bordered style.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Separated</h4>
        <Accordion type="single" collapsible variant="separated">
          <AccordionItem value="item-1">
            <AccordionTrigger>Separated variant</AccordionTrigger>
            <AccordionContent>
              Each accordion item is separated with its own border and shadow.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              Content for the second accordion item in separated style.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Card</h4>
        <Accordion type="single" collapsible variant="card">
          <AccordionItem value="item-1">
            <AccordionTrigger>Card variant</AccordionTrigger>
            <AccordionContent>
              This variant gives each item a card-like appearance with background and shadow.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              Content for the second accordion item in card style.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Minimal</h4>
        <Accordion type="single" collapsible variant="minimal">
          <AccordionItem value="item-1">
            <AccordionTrigger>Minimal variant</AccordionTrigger>
            <AccordionContent>
              This is the most minimal variant with very subtle styling.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              Content for the second accordion item in minimal style.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-2xl">
      <div>
        <h4 className="text-sm font-medium mb-3">Small</h4>
        <Accordion type="single" collapsible size="sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Small accordion</AccordionTrigger>
            <AccordionContent>
              This is a small-sized accordion with compact spacing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Default</h4>
        <Accordion type="single" collapsible size="default">
          <AccordionItem value="item-1">
            <AccordionTrigger>Default accordion</AccordionTrigger>
            <AccordionContent>
              This is the default-sized accordion with standard spacing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Large</h4>
        <Accordion type="single" collapsible size="lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>Large accordion</AccordionTrigger>
            <AccordionContent>
              This is a large-sized accordion with generous spacing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
}

export const DifferentIcons: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-2xl">
      <div>
        <h4 className="text-sm font-medium mb-3">Chevron Icon (Default)</h4>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger icon="chevron">Chevron icon</AccordionTrigger>
            <AccordionContent>
              This accordion uses the default chevron icon that rotates.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Plus/Minus Icon</h4>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger icon="plus">Plus/minus icon</AccordionTrigger>
            <AccordionContent>
              This accordion uses plus/minus icons that toggle between states.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">No Icon</h4>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger icon="none">No icon</AccordionTrigger>
            <AccordionContent>
              This accordion has no icon, showing a clean text-only trigger.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Icon on Left</h4>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger iconPosition="left">Left icon position</AccordionTrigger>
            <AccordionContent>
              This accordion shows the icon on the left side of the trigger.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
}

export const RichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible variant="card" className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-semibold">NEW</span>
            Feature Overview
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>This accordion supports rich content in both triggers and content areas.</p>
            <ul className="list-none space-y-1 text-sm">
              <li>✨ Beautiful gradient backgrounds and hover effects</li>
              <li>🎨 Modern backdrop blur and shadow effects</li>
              <li>📱 Responsive design with smooth animations</li>
              <li>🎯 Multiple variants and size options</li>
              <li>♿ Built-in accessibility features</li>
            </ul>
            <div className="p-4 bg-gradient-to-r from-blue-50 via-primary-50 to-purple-50 rounded-xl border border-primary-200/50 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <strong className="text-primary-800">Pro Tip:</strong>
                  <p className="text-sm text-gray-700 mt-1">You can include any React components within the accordion content, creating rich interactive experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Documentation</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <h5 className="font-semibold">Usage Examples</h5>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<Accordion type="single" collapsible variant="card">
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