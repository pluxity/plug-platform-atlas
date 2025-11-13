import React from 'react'
import AppSideMenu from './AppSideMenu'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppSideMenu />
      <main className="ml-[20rem] min-h-screen p-4 overflow-auto scrollbar-thin">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout