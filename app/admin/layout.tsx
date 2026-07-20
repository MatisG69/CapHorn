import AdminShell from '@/components/admin/AdminShell'

// Hérité par toutes les pages /admin, y compris /admin/login qui est la seule
// accessible sans session et donc la seule réellement explorable.
// robots.ts interdit déjà l'exploration ; ce noindex couvre le cas d'une URL
// découverte par un lien externe, que le Disallow n'empêche pas d'indexer.
export const metadata = {
  title: 'Administration',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
