import type { Meta, StoryObj } from '@storybook/react'
import { Separator, SeparatorWithText } from './separator.component'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '콘텐츠를 시각적으로 구분하는 구분선 컴포넌트입니다. 수평/수직 방향, 다양한 스타일(실선, 점선, 그라데이션)을 지원합니다.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'bold', 'primary', 'success', 'warning', 'error', 'gradient', 'dashed', 'dotted'],
    },
    size: {
      control: 'select',
      options: ['thin', 'default', 'thick'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg', 'xl'],
    },
    decorative: {
      control: 'boolean',
    },
    label: {
      control: 'text',
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

export const Variants: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Separator variant="default" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Subtle</p>
        <Separator variant="subtle" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Bold</p>
        <Separator variant="bold" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Primary</p>
        <Separator variant="primary" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Success</p>
        <Separator variant="success" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Warning</p>
        <Separator variant="warning" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Error</p>
        <Separator variant="error" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Gradient</p>
        <Separator variant="gradient" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Dashed</p>
        <Separator variant="dashed" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Dotted</p>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="space-y-2">
        <p className="text-sm font-medium">Thin</p>
        <Separator size="thin" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Separator size="default" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Thick</p>
        <Separator size="thick" />
      </div>
    </div>
  ),
}

export const WithSpacing: Story = {
  render: () => (
    <div className="w-[400px]">
      <div>
        <p className="text-sm font-medium">Section One</p>
        <p className="text-sm text-gray-600">Content for the first section.</p>
      </div>
      <Separator spacing="sm" />
      <div>
        <p className="text-sm font-medium">Section Two</p>
        <p className="text-sm text-gray-600">Content for the second section.</p>
      </div>
      <Separator spacing="default" />
      <div>
        <p className="text-sm font-medium">Section Three</p>
        <p className="text-sm text-gray-600">Content for the third section.</p>
      </div>
      <Separator spacing="lg" />
      <div>
        <p className="text-sm font-medium">Section Four</p>
        <p className="text-sm text-gray-600">Content for the fourth section.</p>
      </div>
      <Separator spacing="xl" />
      <div>
        <p className="text-sm font-medium">Section Five</p>
        <p className="text-sm text-gray-600">Content for the fifth section.</p>
      </div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="space-y-8 w-[400px]">
      <div>
        <p className="text-sm font-medium mb-2">Using SeparatorWithText</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Before</p>
            <p className="text-sm text-gray-600">Content before separator.</p>
          </div>
          <SeparatorWithText text="OR" />
          <div>
            <p className="text-sm font-medium">After</p>
            <p className="text-sm text-gray-600">Content after separator.</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Using label prop</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Login</p>
            <p className="text-sm text-gray-600">Sign in with your credentials.</p>
          </div>
          <Separator label="OR" />
          <div>
            <p className="text-sm font-medium">Register</p>
            <p className="text-sm text-gray-600">Create a new account.</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Different variants with text</p>
        <div className="space-y-6">
          <SeparatorWithText text="AND" variant="success" />
          <SeparatorWithText text="BUT" variant="warning" />
          <SeparatorWithText text="ALSO" variant="primary" />
          <SeparatorWithText text="HOWEVER" variant="dashed" />
        </div>
      </div>
    </div>
  ),
}

export const VerticalExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium mb-4">Navigation Menu</p>
        <div className="flex h-8 items-center space-x-4 text-sm">
          <div>Home</div>
          <Separator orientation="vertical" />
          <div>About</div>
          <Separator orientation="vertical" variant="primary" />
          <div>Services</div>
          <Separator orientation="vertical" variant="dashed" />
          <div>Contact</div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-4">Different sizes</p>
        <div className="flex h-12 items-center space-x-4 text-sm">
          <div>Item 1</div>
          <Separator orientation="vertical" size="thin" />
          <div>Item 2</div>
          <Separator orientation="vertical" size="default" />
          <div>Item 3</div>
          <Separator orientation="vertical" size="thick" />
          <div>Item 4</div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-4">With spacing</p>
        <div className="flex h-8 items-center text-sm">
          <div>Option A</div>
          <Separator orientation="vertical" spacing="sm" />
          <div>Option B</div>
          <Separator orientation="vertical" spacing="default" />
          <div>Option C</div>
          <Separator orientation="vertical" spacing="lg" />
          <div>Option D</div>
        </div>
      </div>
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
      <Separator spacing="default" />
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

export const FormSections: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Information</h3>
        <div className="mt-2 space-y-2">
          <input className="w-full p-2 border rounded" placeholder="Username" />
          <input className="w-full p-2 border rounded" placeholder="Email" />
        </div>
      </div>

      <Separator label="Personal Details" spacing="default" />

      <div>
        <div className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="First Name" />
          <input className="w-full p-2 border rounded" placeholder="Last Name" />
        </div>
      </div>

      <SeparatorWithText text="Security" variant="primary" />

      <div>
        <div className="space-y-2">
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" />
          <input className="w-full p-2 border rounded" type="password" placeholder="Confirm Password" />
        </div>
      </div>
    </div>
  ),
}