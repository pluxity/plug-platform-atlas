import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { User, Settings, Star, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from './select.component'

const meta: Meta<typeof SelectTrigger> = {
  title: 'Atoms/Select',
  component: SelectTrigger,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '드롭다운 형태의 선택 컴포넌트입니다. 여러 옵션 중 하나를 선택할 때 사용하며 그룹화, 아이콘, 검색 기능을 지원합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled', 'ghost'],
      description: 'Visual variant of the select trigger'
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the select trigger'
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'State of the select trigger'
    },
    loading: {
      control: 'boolean',
      description: 'Whether select is in loading state'
    },
    error: {
      control: 'boolean',
      description: 'Whether select has an error'
    },
    success: {
      control: 'boolean',
      description: 'Whether select shows success state'
    },
    clearable: {
      control: 'boolean',
      description: 'Whether select can be cleared'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    state: 'default',
    loading: false,
    error: false,
    success: false,
    clearable: false
  },
  render: (args) => (
    <Select>
      <SelectTrigger className="w-[220px]" {...args}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// Size variants
export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-[180px]">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent size="sm">
        <SelectItem size="sm" value="option1">Option 1</SelectItem>
        <SelectItem size="sm" value="option2">Option 2</SelectItem>
        <SelectItem size="sm" value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Large: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="lg" className="w-[280px]">
        <SelectValue placeholder="Large select" />
      </SelectTrigger>
      <SelectContent size="lg">
        <SelectItem size="lg" value="option1">Option 1</SelectItem>
        <SelectItem size="lg" value="option2">Option 2</SelectItem>
        <SelectItem size="lg" value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// Variant styles
export const Outline: Story = {
  render: () => (
    <Select>
      <SelectTrigger variant="outline" className="w-[220px]">
        <SelectValue placeholder="Outline variant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Filled: Story = {
  render: () => (
    <Select>
      <SelectTrigger variant="filled" className="w-[220px]">
        <SelectValue placeholder="Filled variant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Ghost: Story = {
  render: () => (
    <Select>
      <SelectTrigger variant="ghost" className="w-[220px]">
        <SelectValue placeholder="Ghost variant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// State variants
export const ErrorState: Story = {
  render: () => (
    <Select>
      <SelectTrigger error className="w-[220px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const SuccessState: Story = {
  render: () => (
    <Select>
      <SelectTrigger success className="w-[220px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const LoadingState: Story = {
  render: () => (
    <Select>
      <SelectTrigger loading className="w-[220px]">
        <SelectValue placeholder="Loading..." />
      </SelectTrigger>
      <SelectContent loading>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// Advanced features
export const WithIcons: Story = {
  render: () => (
    <Select>
      <SelectTrigger icon={<User className="h-4 w-4" />} className="w-[280px]">
        <SelectValue placeholder="Select user type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem icon={<User className="h-4 w-4" />} value="admin">
          Administrator
        </SelectItem>
        <SelectItem icon={<Settings className="h-4 w-4" />} value="moderator">
          Moderator
        </SelectItem>
        <SelectItem icon={<Star className="h-4 w-4" />} value="member">
          Member
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[320px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="free"
          description="Perfect for getting started"
        >
          Free Plan
        </SelectItem>
        <SelectItem
          value="pro"
          description="For growing businesses"
        >
          Pro Plan
        </SelectItem>
        <SelectItem
          value="enterprise"
          description="For large organizations"
        >
          Enterprise Plan
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="development" badge="Local">
          Development
        </SelectItem>
        <SelectItem value="staging" badge="Remote">
          Staging
        </SelectItem>
        <SelectItem value="production" badge="Live">
          Production
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="us-east">
            US East
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="us-west">
            US West
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="canada">
            Canada
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="uk">
            United Kingdom
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="germany">
            Germany
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="france">
            France
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="japan">
            Japan
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="singapore">
            Singapore
          </SelectItem>
          <SelectItem icon={<MapPin className="h-4 w-4" />} value="australia">
            Australia
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string>("")

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger
          clearable
          onClear={() => setValue("")}
          className="w-[220px]"
        >
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectContent>
      </Select>
    )
  },
}

export const EmptyState: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="No options available" />
      </SelectTrigger>
      <SelectContent emptyMessage="No items found">
        {/* No items */}
      </SelectContent>
    </Select>
  ),
}

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent maxHeight={200}>
        {[
          'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia',
          'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada',
          'China', 'Denmark', 'Egypt', 'Finland', 'France',
          'Germany', 'Greece', 'India', 'Indonesia', 'Iran',
          'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
          'Korea', 'Malaysia', 'Mexico', 'Netherlands', 'Norway',
          'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia',
          'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sweden',
          'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
          'United States', 'Vietnam'
        ].map(country => (
          <SelectItem key={country} value={country.toLowerCase()}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}