import Link from 'next/link'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { getPublishedPosts } from '@/lib/blog/queries'
import { blogCategoryLabel } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog & conseils, Financement, immobilier, professions libérales · Cap Horn Conseils',
  description:
    "Articles et conseils de Cap Horn Conseils : financement professionnel, immobilier, professions libérales, franchise, assurance emprunteur, reprise et transmission d'entreprise.",
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts()
  const [featured, ...rest] = posts

  return (
    <div className="chc">
      <ChcNav active="/blog" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Le blog</div>
          <h1 className="chc-pagehead__title">Conseils &amp; analyses,<br /><em>sur le financement.</em></h1>
          <p className="chc-pagehead__lead">
            Décryptages, méthodes et cas concrets, immobilier, financement professionnel, professions
            libérales, assurance emprunteur, reprise et transmission. Par Cap Horn Conseils.
          </p>
        </div>
      </header>

      <section className="chc-section">
        <div className="chc-wrap">
          {posts.length === 0 ? (
            <div className="r" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', padding: '40px 0 20px' }}>
              <div className="chc-eyebrow" style={{ justifyContent: 'center' }}>Bientôt</div>
              <h2 className="chc-h2" style={{ marginTop: 10 }}>Les premiers articles<br /><em>arrivent.</em></h2>
              <p className="chc-lead" style={{ marginTop: 18, marginBottom: 28 }}>
                Conseils de financement, méthodes et cas concrets, publiés régulièrement par Guillaume.
                En attendant, lancez votre étude personnalisée.
              </p>
              <LiquidButton href="/tunnel" tone="light" size="lg">Démarrer mon étude gratuite</LiquidButton>
            </div>
          ) : (
            <>
              {/* Article à la une */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="chc-blog-feature r">
                  <div
                    className="chc-blog-feature__img"
                    style={featured.cover_image_url ? { backgroundImage: `url(${featured.cover_image_url})` } : undefined}
                  />
                  <div className="chc-blog-feature__body">
                    <div className="chc-blog__meta">
                      <span>{blogCategoryLabel(featured.category)}</span>
                      <span>·</span>
                      <span>{formatDate(featured.published_at)}</span>
                    </div>
                    <h2 className="chc-blog-feature__title">{featured.title}</h2>
                    {featured.excerpt && <p className="chc-blog-feature__excerpt">{featured.excerpt}</p>}
                    <span className="chc-btn-link" style={{ marginTop: 18, display: 'inline-block' }}>Lire l’article</span>
                  </div>
                </Link>
              )}

              {/* Grille des autres articles */}
              {rest.length > 0 && (
                <div className="chc-blog-grid">
                  {rest.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="chc-blog-card r">
                      <div
                        className="chc-blog-card__img"
                        style={post.cover_image_url ? { backgroundImage: `url(${post.cover_image_url})` } : undefined}
                      />
                      <div className="chc-blog-card__body">
                        <div className="chc-blog__meta">
                          <span>{blogCategoryLabel(post.category)}</span>
                          <span>·</span>
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <h3 className="chc-blog-card__title">{post.title}</h3>
                        {post.excerpt && <p className="chc-blog-card__excerpt">{post.excerpt}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
