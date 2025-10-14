import React from 'react'
import { SidebarTrigger } from '@plug-atlas/ui'
import { Separator } from '@plug-atlas/ui'

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white border-b z-10 shadow-xs sticky top-0">
      <div className="flex items-center gap-2 px-4 py-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="홈으로 이동"
              >
                Plug Platform Admin
              </button>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin Profile will go here */}
            <div className="text-sm text-gray-600">Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
