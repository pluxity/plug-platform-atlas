import React from 'react'
import AppSideMenu from './AppSideMenu'
import { Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppSideMenu />
      <main className="ml-[21rem] min-h-screen p-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default AdminLayout
