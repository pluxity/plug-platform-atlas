import { LogOut, User } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@plug-atlas/ui'
import { useAuthStore } from '../../stores'

export default function GNBUserMenu() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const displayName = user?.name ?? '사용자'
  const roleLabel = user?.roles?.map((role) => role.name).join(', ') || '일반 사용자'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors outline-none">
          <Avatar className="size-7">
            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
              {displayName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem disabled className="flex items-center gap-2 text-gray-500">
          <User className="size-4" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{displayName}</span>
            <span className="text-xs text-gray-500">{roleLabel}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
          onClick={logout}
        >
          <LogOut className="size-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
