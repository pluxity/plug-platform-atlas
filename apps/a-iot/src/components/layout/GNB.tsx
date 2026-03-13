import { Separator } from '@plug-atlas/ui'
import { GNB_MENU_ITEMS } from '../../constants/menu'
import { getAssetPath } from '../../utils/assetPath'
import GNBMenuItem from './GNBMenuItem'
import GNBUserMenu from './GNBUserMenu'
import GNBNotification from './GNBNotification'

export default function GNB() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6 shrink-0">
        <img src={getAssetPath('/images/logos/CI.svg')} alt="Logo" className="h-6" />
        <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
          성남시 시민안심공원
        </span>
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-200 mr-2" />

      {/* Menu Items */}
      <nav className="flex items-center gap-0.5">
        {GNB_MENU_ITEMS.map((item) => (
          <GNBMenuItem key={item.title} item={item} />
        ))}
      </nav>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2">
        <GNBNotification />
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        <GNBUserMenu />
      </div>
    </header>
  )
}
