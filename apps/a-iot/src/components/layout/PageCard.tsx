export default function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-9">
      {children}
    </div>
  )
}
