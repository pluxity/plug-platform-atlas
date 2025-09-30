import type { StoryObj } from '@storybook/react'
import { AspectRatio } from './aspect-ratio.component'

const meta = {
  title: 'Atoms/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '특정 비율(16:9, 4:3 등)을 유지하는 컨테이너 컴포넌트입니다. 이미지나 비디오의 가로세로 비율을 일관되게 유지할 때 사용됩니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&dpr=2&q=80"
          alt="Photo by Ravi Sharma"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={3 / 4}>
        <img
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&dpr=2&q=80"
          alt="Photo by Alexandru Acea"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
}

export const WithVideo: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
      </AspectRatio>
    </div>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Custom Content</h3>
            <p className="text-sm text-muted-foreground">
              This is a custom content inside an aspect ratio container
            </p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const DifferentRatios: Story = {
  render: () => (
    <div className="space-y-4 w-[450px]">
      <div>
        <h4 className="text-sm font-medium mb-2">21:9 (Ultra-wide)</h4>
        <AspectRatio ratio={21 / 9} className="bg-muted rounded-md">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm">21:9</span>
          </div>
        </AspectRatio>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">16:9 (Widescreen)</h4>
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm">16:9</span>
          </div>
        </AspectRatio>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">4:3 (Standard)</h4>
        <AspectRatio ratio={4 / 3} className="bg-muted rounded-md">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm">4:3</span>
          </div>
        </AspectRatio>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">1:1 (Square)</h4>
        <AspectRatio ratio={1} className="bg-muted rounded-md">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm">1:1</span>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
}