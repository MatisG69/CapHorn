import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPostById, getPublishedPosts } from '@/lib/blog/queries'
import BlogEditor from '@/components/admin/BlogEditor'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  const published = await getPublishedPosts()
  const linkablePosts = published
    .filter((p) => p.id !== post.id)
    .map((p) => ({ id: p.id, title: p.title, slug: p.slug }))

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour au blog
      </Link>
      <h1 className="display-serif text-3xl text-[var(--color-cream)] tracking-tight">Modifier l’article</h1>
      <BlogEditor post={post} linkablePosts={linkablePosts} />
    </div>
  )
}
