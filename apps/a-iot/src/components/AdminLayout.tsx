import React from 'react'
import AppSideMenu from './AppSideMenu'
import { Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <AppSideMenu />
      <main className="ml-[304px] min-h-screen p-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default AdminLayout
