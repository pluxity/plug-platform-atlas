import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '../../atoms/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.component'

const meta: Meta<typeof Collapsible> = {
  title: 'Molecules/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '콘텐츠를 접고 펼칠 수 있는 컴포넌트입니다. 아코디언과 유사하지만 단일 항목에 사용되며, 더 많은 정보를 숨기거나 표시할 때 사용됩니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}

export const WithControlledState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="w-[350px] space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Reset
          </Button>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Controlled Collapsible</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            Always visible content
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">
              Hidden content 1
            </div>
            <div className="rounded-md border px-4 py-3 text-sm">
              Hidden content 2
            </div>
            <div className="rounded-md border px-4 py-3 text-sm">
              Hidden content 3
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
}

export const SimpleCollapsible: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
        <span className="text-sm font-medium">Click to expand</span>
        <ChevronDownIcon className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-2">
        <div className="text-sm text-gray-600">
          This is the collapsible content that will be hidden/shown when the trigger is clicked.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}