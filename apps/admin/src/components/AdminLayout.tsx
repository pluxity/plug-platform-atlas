import React from 'react'
import AdminHeader from './AdminHeader'
import { Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <main className="flex-1 overflow-hidden bg-white">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default AdminLayout
