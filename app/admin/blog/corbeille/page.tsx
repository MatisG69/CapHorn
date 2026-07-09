import Link from 'next/link'
import { getTrashedPosts } from '@/lib/blog/queries'
import { blogCategoryLabel } from '@/lib/types'
import { formatRelativeDate } from '@/lib/admin/labels'
import { ArrowLeft } from 'lucide-react'
import TrashPostButtons from '@/components/admin/TrashPostButtons'

export const dynamic = 'force-dynamic'

export default async function BlogTrashPage() {
  const posts = await getTrashedPosts()

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour au blog
          </Link>
          <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Corbeille</h1>
          <p className="text-sm text-[var(--color-cream-dim)] mt-2">
            {posts.length} article{posts.length !== 1 ? 's' : ''} supprimé{posts.length !== 1 ? 's' : ''} · restaurable{posts.length !== 1 ? 's' : ''} à tout moment
          </p>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-cream-mute)] text-sm">
            La corbeille est vide.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-ink-line)]">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-cream)] truncate">{post.title}</div>
                  <div className="text-xs text-[var(--color-cream-mute)] mt-1">
                    {blogCategoryLabel(post.category)}
                    {post.deleted_at ? ` · supprimé ${formatRelativeDate(post.deleted_at)}` : ''}
                  </div>
                </div>
                <TrashPostButtons postId={post.id} title={post.title} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
