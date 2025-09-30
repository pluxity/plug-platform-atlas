import type { StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group.component'
import { Label } from '../label'

const meta = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '여러 옵션 중 하나를 선택하는 라디오 버튼 그룹 컴포넌트입니다. 배타적 선택이 필요한 폼에 사용됩니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="d1" />
        <Label htmlFor="d1">Option One (Disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="d2" />
        <Label htmlFor="d2">Option Two (Disabled)</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="grid gap-4">
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="card" id="card" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="card" className="font-medium">
              Card Payment
            </Label>
            <p className="text-sm text-muted-foreground">
              Pay with your credit or debit card.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="paypal" className="font-medium">
              PayPal
            </Label>
            <p className="text-sm text-muted-foreground">
              Pay with your PayPal account.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="crypto" id="crypto" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="crypto" className="font-medium">
              Cryptocurrency
            </Label>
            <p className="text-sm text-muted-foreground">
              Pay with Bitcoin or other cryptocurrencies.
            </p>
          </div>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const HorizontalLayout: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" className="flex flex-row gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="h1" />
        <Label htmlFor="h1">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="h2" />
        <Label htmlFor="h2">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="h3" />
        <Label htmlFor="h3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
}