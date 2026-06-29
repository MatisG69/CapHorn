import Link from 'next/link'
import { getAllPosts } from '@/lib/blog/queries'
import { blogCategoryLabel } from '@/lib/types'
import { formatRelativeDate } from '@/lib/admin/labels'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import DeletePostButton from '@/components/admin/DeletePostButton'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow eyebrow--single mb-3">Contenus</p>
          <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Blog</h1>
          <p className="text-sm text-[var(--color-cream-dim)] mt-2">
            {posts.length} article{posts.length !== 1 ? 's' : ''} · {posts.filter((p) => p.published).length} publié{posts.filter((p) => p.published).length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold text-sm px-4 py-2.5">
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-cream-mute)] text-sm">
            Aucun article pour le moment. Cliquez sur « Nouvel article » pour commencer.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-ink-line)]">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-medium text-[var(--color-cream)] truncate">{post.title}</span>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${
                      post.published
                        ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                        : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)]'
                    }`}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-cream-mute)] mt-1">
                    {blogCategoryLabel(post.category)} · modifié {formatRelativeDate(post.updated_at)}
                  </div>
                </div>

                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
                    title="Voir l'article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] hover:border-[var(--color-gold-deep)] transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Modifier
                </Link>
                <DeletePostButton postId={post.id} title={post.title} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
