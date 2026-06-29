import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh" style={{ background: '#0E0C09' }}>
      <Sidebar />
      <main className="admin-main flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
