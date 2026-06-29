'use client'

import { BlogContent } from '@/components/blog/BlogContent'
import { blogCategoryLabel } from '@/lib/types'

interface Props {
  title: string
  excerpt: string
  body: string
  coverUrl: string
  category: string
}

/** Aperçu en direct de l'article tel qu'il s'affichera sur le blog public. */
export default function BlogPreview({ title, excerpt, body, coverUrl, category }: Props) {
  return (
    <div className="chc" style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-ink-line)', boxShadow: 'var(--admin-card-shadow)' }}>
      <div style={{ background: 'var(--chc-cream)', maxHeight: '76vh', overflowY: 'auto' }}>
        <div style={{ padding: '36px clamp(20px,4vw,40px) 20px', textAlign: 'center' }}>
          <div className="chc-blog__meta" style={{ justifyContent: 'center' }}>
            <span>{blogCategoryLabel(category)}</span>
            <span>·</span>
            <span>Aujourd’hui</span>
          </div>
          <h1 className="chc-article__title" style={{ fontSize: 'clamp(24px,3vw,38px)', marginTop: 14 }}>
            {title || 'Titre de l’article'}
          </h1>
          {excerpt && <p className="chc-article__lead">{excerpt}</p>}
        </div>

        {coverUrl && (
          <div style={{ padding: '0 clamp(20px,4vw,40px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" style={{ width: '100%', borderRadius: 14, display: 'block' }} />
          </div>
        )}

        <div className="chc-article__wrap" style={{ marginTop: 26, paddingBottom: 40 }}>
          {body.trim() ? (
            <BlogContent body={body} />
          ) : (
            <p style={{ color: 'var(--chc-lite)', fontStyle: 'italic', fontFamily: 'var(--chc-sans)' }}>
              Le contenu de l’article apparaîtra ici, exactement comme sur le blog public.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
