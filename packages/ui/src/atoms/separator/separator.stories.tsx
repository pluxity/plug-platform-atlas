import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator.component'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '콘텐츠를 시각적으로 구분하는 구분선 컴포넌트입니다. 수평 또는 수직 방향으로 사용할 수 있습니다.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '구분선 방향',
    },
    decorative: {
      control: 'boolean',
      description: '장식용 여부 (접근성)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <div>
        <p className="text-sm font-medium">Radix Primitives</p>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator {...args} />
      <div>
        <p className="text-sm font-medium">Tailwind CSS</p>
        <p className="text-sm text-muted-foreground">
          A utility-first CSS framework for rapid UI development.
        </p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-20 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator {...args} />
      <div>Docs</div>
      <Separator {...args} />
      <div>Source</div>
    </div>
  ),
}

export const InMenu: Story = {
  render: () => (
    <div className="space-y-1 w-[300px]">
      <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
      <p className="text-sm text-muted-foreground">
        An open-source UI component library.
      </p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
}

export const CustomSpacing: Story = {
  render: () => (
    <div className="w-[400px]">
      <div>
        <p className="text-sm font-medium">Section One</p>
        <p className="text-sm text-muted-foreground">Content for the first section.</p>
      </div>
      <Separator className="my-2" />
      <div>
        <p className="text-sm font-medium">Section Two</p>
        <p className="text-sm text-muted-foreground">Content for the second section.</p>
      </div>
      <Separator className="my-4" />
      <div>
        <p className="text-sm font-medium">Section Three</p>
        <p className="text-sm text-muted-foreground">Content for the third section.</p>
      </div>
      <Separator className="my-6" />
      <div>
        <p className="text-sm font-medium">Section Four</p>
        <p className="text-sm text-muted-foreground">Content for the fourth section.</p>
      </div>
    </div>
  ),
}

export const VerticalNavigation: Story = {
  render: () => (
    <div className="flex h-8 items-center space-x-4 text-sm">
      <div>Home</div>
      <Separator orientation="vertical" />
      <div>About</div>
      <Separator orientation="vertical" />
      <div>Services</div>
      <Separator orientation="vertical" />
      <div>Contact</div>
    </div>
  ),
}
