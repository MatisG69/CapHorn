import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { BlogContent } from '@/components/blog/BlogContent'
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/blog/queries'
import { blogCategoryLabel } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return { title: 'Article introuvable · Cap Horn Conseils' }
  return {
    title: `${post.title} · Cap Horn Conseils`,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_image_url ? { images: [post.cover_image_url] } : undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <div className="chc">
      <ChcNav active="/blog" />

      <article className="chc-article">
        <div className="chc-article__head r">
          <Link href="/blog" className="chc-article__back">
            <ArrowLeft className="w-3.5 h-3.5" /> Tous les articles
          </Link>
          <div className="chc-blog__meta" style={{ marginTop: 22 }}>
            <span>{blogCategoryLabel(post.category)}</span>
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="chc-article__title">{post.title}</h1>
          {post.excerpt && <p className="chc-article__lead">{post.excerpt}</p>}
        </div>

        {post.cover_image_url && (
          <div className="chc-article__cover r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} />
          </div>
        )}

        <div className="chc-article__wrap r">
          <BlogContent body={post.body} />
        </div>

        <div className="chc-article__cta r">
          <div className="chc-eyebrow">Votre projet</div>
          <h2 className="chc-h2">Un financement à étudier ?</h2>
          <p className="chc-lead" style={{ marginTop: 14, marginBottom: 26 }}>
            Cap Horn qualifie votre projet en 3 minutes et vous rappelle sous 24 h.
          </p>
          <LiquidButton href="/tunnel" tone="light" size="lg">
            Démarrer mon étude gratuite <ArrowRight className="w-4 h-4" />
          </LiquidButton>
        </div>
      </article>

      {others.length > 0 && (
        <section className="chc-section chc-section--white">
          <div className="chc-wrap">
            <div className="chc-eyebrow r">À lire aussi</div>
            <div className="chc-blog-grid" style={{ marginTop: 28 }}>
              {others.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="chc-blog-card r">
                  <div
                    className="chc-blog-card__img"
                    style={p.cover_image_url ? { backgroundImage: `url(${p.cover_image_url})` } : undefined}
                  />
                  <div className="chc-blog-card__body">
                    <div className="chc-blog__meta">
                      <span>{blogCategoryLabel(p.category)}</span>
                      <span>·</span>
                      <span>{formatDate(p.published_at)}</span>
                    </div>
                    <h3 className="chc-blog-card__title">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ChcFooter />
    </div>
  )
}
