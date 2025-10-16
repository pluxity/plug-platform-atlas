import React from 'react'
import AppSidebar from './AppSidebar'
import { SidebarProvider, SidebarInset, Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default AdminLayout
