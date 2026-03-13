import { Toaster } from '@plug-atlas/ui'
import GNB from './GNB'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page-bg">
      <GNB />
      <main className="px-6 py-4">{children}</main>
      <Toaster />
    </div>
  )
}
