import { LogOut, User } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@plug-atlas/ui'
import { useAuthStore } from '../../stores'

export default function GNBUserMenu() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const currentUser = user
    ? { ...user, avatar: '' }
    : { name: '관리자', role: 'admin', avatar: '' }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors outline-none">
          <Avatar className="size-7">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
              {currentUser.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline">{currentUser.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem disabled className="flex items-center gap-2 text-gray-500">
          <User className="size-4" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
            <span className="text-xs text-gray-500">{currentUser.role || '일반 사용자'}</span>
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
