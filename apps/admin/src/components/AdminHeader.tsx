import React from 'react'

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white border-b z-10 shadow-xs">
      <div className="px-2 pl-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="홈으로 이동"
              >
                <img
                  src="/logo.svg"
                  alt="Plug Platform"
                  className="h-8 w-auto select-none"
                  draggable={false}
                />
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
