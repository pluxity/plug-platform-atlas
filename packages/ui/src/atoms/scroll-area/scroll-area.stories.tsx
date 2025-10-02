import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea, ScrollBar } from './scroll-area.component'
import { Separator } from '../separator/separator.component'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/card/card.component'
import { Badge } from '../badge/badge.component'

const meta: Meta<typeof ScrollArea> = {
  title: 'Atoms/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '커스텀 스크롤바를 제공하는 스크롤 영역 컴포넌트입니다. 네이티브 스크롤 동작을 유지하면서 일관된 크로스 브라우저 스타일을 제공합니다.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Generate sample data
const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const artworks = [
  {
    artist: 'Ornella Binni',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Tom Byrom',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Vladimir Malyavko',
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Eleni Afiontzi',
    art: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Wolfgang Hasselmann',
    art: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=300&q=80',
  },
]

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {artworks.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <img
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{' '}
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const Both: Story = {
  render: () => (
    <ScrollArea className="h-[400px] w-[600px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-lg font-medium">Large Content Area</h4>
        <div className="w-[1200px] space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>
              <p className="text-sm">
                This is a wide line of text that extends beyond the viewport width.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              {i < 19 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const WithTags: Story = {
  render: () => {
    const technologies = [
      'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js',
      'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker',
      'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git',
      'GitHub', 'GitLab', 'Bitbucket', 'Jest', 'Cypress',
      'Playwright', 'Storybook', 'Figma', 'Sketch', 'Adobe XD',
      'Webpack', 'Vite', 'Rollup', 'Babel', 'ESLint',
      'Prettier', 'Husky', 'Lint-staged', 'GraphQL', 'Apollo',
      'Redux', 'MobX', 'Zustand', 'Jotai', 'Recoil',
    ]

    return (
      <ScrollArea className="h-72 w-80 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </ScrollArea>
    )
  },
}

export const InCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="size-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Notification {i + 1}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This is a sample notification message. It could contain important
                    information for the user.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i + 1} hour{i !== 0 ? 's' : ''} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  ),
}

export const LongList: Story = {
  render: () => (
    <ScrollArea className="h-[500px] w-80 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">
          Version History
        </h4>
        <div className="space-y-2">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div className="text-sm">v{100 - i}.0.0</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(2024, 0, 100 - i).toLocaleDateString()}
                </div>
              </div>
              {i < 99 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
}

export const TextContent: Story = {
  render: () => (
    <ScrollArea className="h-96 w-[600px] rounded-md border">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">
          Terms and Conditions
        </h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,
            nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl
            nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl
            aliquet nunc, quis aliquam nisl nunc quis nisl.
          </p>
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident.
          </p>
          <p>
            Sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
          <p>
            Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
            id est laborum.
          </p>
        </div>
      </div>
    </ScrollArea>
  ),
}
