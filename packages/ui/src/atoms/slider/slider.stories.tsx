import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './slider.component'
import { Label } from '../label'

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '값 범위를 선택할 수 있는 슬라이더 컴포넌트입니다. 단일 값 선택과 범위 선택을 지원하며, 접근성을 고려한 키보드 조작이 가능합니다.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[300px]',
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: 'w-[300px]',
  },
}

export const WithLabels: Story = {
  render: () => {
    const [value, setValue] = useState([50])
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    )
  },
}

export const RangeWithLabels: Story = {
  render: () => {
    const [value, setValue] = useState([25, 75])
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label>Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${value[0]} - ${value[1]}
          </span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$100</span>
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    className: 'w-[300px]',
  },
}

export const Stepped: Story = {
  render: () => {
    const [value, setValue] = useState([50])
    const steps = [0, 25, 50, 75, 100]
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label>Level</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={25}
          className="relative"
        />
        <div className="relative flex justify-between text-xs text-muted-foreground">
          {steps.map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className="w-px h-2 bg-muted-foreground/30" />
              <span className="mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const SmallStep: Story = {
  render: () => {
    const [value, setValue] = useState([50])
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label>Precision Control</Label>
          <span className="text-sm text-muted-foreground">
            {value[0]?.toFixed(1) ?? '0.0'}
          </span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={0.1}
        />
      </div>
    )
  },
}

export const CustomRange: Story = {
  render: () => {
    const [value, setValue] = useState([2025])
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label>Year</Label>
          <span className="text-sm text-muted-foreground">{value[0]}</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          min={2020}
          max={2030}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2020</span>
          <span>2030</span>
        </div>
      </div>
    )
  },
}

export const MultipleSliders: Story = {
  render: () => {
    const [brightness, setBrightness] = useState([80])
    const [contrast, setContrast] = useState([50])
    const [saturation, setSaturation] = useState([60])

    return (
      <div className="w-[300px] space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="brightness">Brightness</Label>
            <span className="text-sm text-muted-foreground">
              {brightness[0]}%
            </span>
          </div>
          <Slider
            id="brightness"
            value={brightness}
            onValueChange={setBrightness}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">Contrast</Label>
            <span className="text-sm text-muted-foreground">
              {contrast[0]}%
            </span>
          </div>
          <Slider
            id="contrast"
            value={contrast}
            onValueChange={setContrast}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation">Saturation</Label>
            <span className="text-sm text-muted-foreground">
              {saturation[0]}%
            </span>
          </div>
          <Slider
            id="saturation"
            value={saturation}
            onValueChange={setSaturation}
            max={100}
            step={1}
          />
        </div>
      </div>
    )
  },
}
