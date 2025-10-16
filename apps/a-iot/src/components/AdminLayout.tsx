import React from 'react'
import AdminHeader from './AdminHeader'
import AppSidebar from './AppSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger, Toaster } from '@plug-atlas/ui'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-white p-4">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default AdminLayout
