import type { Meta, StoryObj } from '@storybook/react'
import {
  FileText,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Search,
  ZoomIn,
  ZoomOut,
  Save,
  FolderOpen,
  FileCode,
  Settings,
  Share2,
  Mail,
  MessageSquare,
  Download,
  Upload,
} from 'lucide-react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarLabel,
} from './menubar.component'

const meta: Meta<typeof Menubar> = {
  title: 'Molecules/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '애플리케이션 메뉴 바 컴포넌트입니다. 드롭다운 메뉴와 서브메뉴를 지원합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Reset Zoom <MenubarShortcut>⌘0</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Toggle Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            New File
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderOpen />
            Open File
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Save />
            Save
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FileCode />
            Save As...
            <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Upload />
            Export
          </MenubarItem>
          <MenubarItem>
            <Download />
            Import
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo />
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo />
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Scissors />
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Copy />
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Clipboard />
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Search />
            Find
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <ZoomIn />
            Zoom In
            <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <ZoomOut />
            Zoom Out
            <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithRadioItems: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Panel Position</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value="left">
            <MenubarRadioItem value="left">Left</MenubarRadioItem>
            <MenubarRadioItem value="right">Right</MenubarRadioItem>
            <MenubarRadioItem value="bottom">Bottom</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarLabel>Theme</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value="light">
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Font Size</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="medium">
            <MenubarRadioItem value="small">Small</MenubarRadioItem>
            <MenubarRadioItem value="medium">Medium</MenubarRadioItem>
            <MenubarRadioItem value="large">Large</MenubarRadioItem>
            <MenubarRadioItem value="xlarge">Extra Large</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithCheckboxItems: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Show Panels</MenubarLabel>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>
            Status Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Activity Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Panel
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>
            Minimap
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Breadcrumbs
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Options</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Editor Settings</MenubarLabel>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>
            Auto Save
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Word Wrap
          </MenubarCheckboxItem>
          <MenubarCheckboxItem disabled>
            Ligatures (Pro only)
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithSubmenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            New File
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Share2 />
              Share
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Mail />
                Email
              </MenubarItem>
              <MenubarItem>
                <MessageSquare />
                Message
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Copy Link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>
              <Download />
              Export
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Export as PDF</MenubarItem>
              <MenubarItem>Export as PNG</MenubarItem>
              <MenubarItem>Export as SVG</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Export as JSON</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Settings />
            Settings
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo />
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo />
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Search />
              Find & Replace
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                Find
                <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Find in Files
                <MenubarShortcut>⇧⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Replace
                <MenubarShortcut>⌘H</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Replace in Files
                <MenubarShortcut>⇧⌘H</MenubarShortcut>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const WithShortcuts: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Open File
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open Folder
            <MenubarShortcut>⌘⇧O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Save
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save All
            <MenubarShortcut>⌘K S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Close Tab
            <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Close Window
            <MenubarShortcut>⌘⇧W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Select All
            <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Command Palette
            <MenubarShortcut>⌘⇧P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Zoom In
            <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Zoom Out
            <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Reset Zoom
            <MenubarShortcut>⌘0</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Toggle Fullscreen
            <MenubarShortcut>⌃⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
