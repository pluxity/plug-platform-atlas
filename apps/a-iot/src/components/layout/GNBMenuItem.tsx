import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@plug-atlas/ui'
import type { MenuItem } from '../../constants/menu'

interface GNBMenuItemProps {
  item: MenuItem
}

export default function GNBMenuItem({ item }: GNBMenuItemProps) {
  const { pathname } = useLocation()

  const isActive = (path?: string) => {
    if (!path) return false
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const isGroupActive = item.children?.some((child) => isActive(child.path)) ?? false
  const active = item.path ? isActive(item.path) : isGroupActive

  // Simple link item (no children)
  if (!item.children || item.children.length === 0) {
    return (
      <Link
        to={item.path || '/'}
        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
          active
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <item.icon className="size-4" />
        <span>{item.title}</span>
        {active && (
          <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Link>
    )
  }

  // Dropdown menu item (has children)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors outline-none rounded-md ${
            active
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <item.icon className="size-4" />
          <span>{item.title}</span>
          <ChevronDown className="size-3" />
          {active && (
            <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {item.children.map((child) => (
          <DropdownMenuItem key={child.title} asChild>
            <Link
              to={child.path || '#'}
              className={`flex items-center gap-2 ${
                isActive(child.path)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : ''
              }`}
            >
              <child.icon className="size-4" />
              <span>{child.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
