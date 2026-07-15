import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BlogEditor from '@/components/admin/BlogEditor'
import { getPublishedPosts } from '@/lib/blog/queries'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  const published = await getPublishedPosts()
  const linkablePosts = published.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))
  return (
    <div className="p-8 space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour au blog
      </Link>
      <h1 className="display-serif text-3xl text-[var(--color-cream)] tracking-tight">Nouvel article</h1>
      <BlogEditor post={null} linkablePosts={linkablePosts} />
    </div>
  )
}
