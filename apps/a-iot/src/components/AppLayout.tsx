import React from 'react'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-3 py-1 rounded-full z-10 select-none">
        © 2025 Pluxity. All rights reserved.
      </span>
    </div>
  )
}

export default AppLayout
