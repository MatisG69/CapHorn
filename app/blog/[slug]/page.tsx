import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { BlogContent } from '@/components/blog/BlogContent'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/blog/queries'
import { blogCategoryLabel } from '@/lib/types'
import { JsonLd } from '@/components/seo/JsonLd'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/jsonld'

// ISR plutôt que force-dynamic : l'article est servi depuis le cache (bien
// meilleur LCP et budget de crawl) et rafraîchi au plus toutes les 10 min.
// Un article programmé apparaît donc avec ce délai maximum, au lieu d'être
// immédiat — compromis assumé au profit de la performance.
export const revalidate = 600

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Prérend chaque article publié au build : Google reçoit du HTML servi depuis
 * le cache. Un article publié après le build reste rendu à la demande puis
 * mis en cache (dynamicParams est à true par défaut).
 */
export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** ~200 mots/minute, plancher à 1 min. */
function readingMinutes(body: string) {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Tronque proprement sur un mot pour rester sous la limite d'affichage SERP. */
function clamp(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, clean.lastIndexOf(' ', max - 1))}…`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article introuvable',
      description: "Cet article n'existe pas ou n'est plus disponible.",
      robots: { index: false, follow: true },
    }
  }

  const description = post.excerpt
    ? clamp(post.excerpt)
    : clamp(post.body.replace(/[#*_>`[\]()]/g, ' '))
  const path = `/blog/${post.slug}`

  return {
    // Le suffixe de marque vient de title.template (app/layout.tsx).
    title: clamp(post.title, 60),
    description,
    keywords: post.keywords?.split(',').map((k) => k.trim()).filter(Boolean),
    authors: [{ name: post.author }],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title: post.title,
      description,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at ?? post.published_at,
      authors: [post.author],
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <div className="chc">
      <JsonLd
        schema={articleSchema({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          image: post.cover_image_url,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          author: post.author,
        })}
      />
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <ChcNav active="/blog" />
      <ReadingProgress targetId="article-body" />

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
            <span>{readingMinutes(post.body)} min de lecture</span>
          </div>
          <h1 className="chc-article__title">{post.title}</h1>
          {post.excerpt && <p className="chc-article__lead">{post.excerpt}</p>}
          <div className="chc-article__byline">
            <span className="chc-article__avatar" aria-hidden="true">
              {post.author.trim().charAt(0).toUpperCase()}
            </span>
            <span>
              Par <strong>{post.author}</strong> · Cap Horn Conseils
            </span>
          </div>
        </div>

        {post.cover_image_url && (
          <div className="chc-article__cover r">
            {/* width/height : réserve le ratio 16/9 et évite le décalage de
                mise en page (CLS) pendant le chargement de la couverture.
                fetchPriority=high : c'est l'élément LCP de l'article. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              width={1600}
              height={900}
              fetchPriority="high"
            />
          </div>
        )}

        {/* Pas de classe `r` ici : le corps de l'article ne doit jamais dépendre
            du JS de reveal pour être lisible. */}
        <div className="chc-article__wrap" id="article-body">
          <BlogContent body={post.body} />
        </div>

        <div className="chc-article__cta r">
          <div className="chc-eyebrow">Votre projet</div>
          <h2 className="chc-h2">Un financement à étudier ?</h2>
          <p className="chc-lead" style={{ marginTop: 14, marginBottom: 26 }}>
            Cap Horn qualifie votre projet en 3 minutes et vous rappelle sous 24 h.
          </p>
          <LiquidButton href="/tunnel" tone="dark" size="lg">
            Démarrer mon étude gratuite <ArrowRight className="w-4 h-4" />
          </LiquidButton>
        </div>
      </article>

      {others.length > 0 && (
        <section className="chc-section chc-section--white">
          <div className="chc-wrap">
            <div className="chc-eyebrow r">À lire aussi</div>
            <div className="chc-blog-grid chc-blog-grid--pair" style={{ marginTop: 28 }}>
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
                      <span>{readingMinutes(p.body)} min</span>
                    </div>
                    <h3 className="chc-blog-card__title">{p.title}</h3>
                    {p.excerpt && <p className="chc-blog-card__excerpt">{p.excerpt}</p>}
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
