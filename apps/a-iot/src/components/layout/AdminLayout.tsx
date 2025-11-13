import React from 'react'
import AppSideMenu from './AppSideMenu'
import { Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppSideMenu />
      <main className="ml-[20rem] min-h-screen p-4 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-full">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}

export default AdminLayout
