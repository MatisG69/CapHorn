'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createPostAction, updatePostAction, type BlogPostInput } from '@/app/admin/blog/actions'
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/types'
import { ImagePlus, Save, Loader2, Eye, EyeOff, Clock, Link2, FileText } from 'lucide-react'
import BlogPreview from './BlogPreview'

export interface LinkablePost {
  id: string
  title: string
  slug: string
}

interface Props {
  post: BlogPost | null
  /** Articles déjà publiés, proposés pour créer des liens internes. */
  linkablePosts?: LinkablePost[]
}

type PubMode = 'now' | 'schedule' | 'draft'

/** ISO → valeur d'un `<input type="datetime-local">` (heure locale du navigateur). */
function isoToLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Proposition par défaut : prochaine heure pleine (ex. « demain 9 h » à ajuster). */
function defaultScheduleLocal(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  d.setMinutes(0, 0, 0)
  return isoToLocalInput(d.toISOString())
}

function initialMode(post: BlogPost | null): PubMode {
  if (!post) return 'now'
  if (!post.published) return 'draft'
  if (post.published_at && new Date(post.published_at).getTime() > Date.now()) return 'schedule'
  return 'now'
}

export default function BlogEditor({ post, linkablePosts = [] }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [category, setCategory] = useState(post?.category ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '')
  const [badge, setBadge] = useState(post?.badge ?? '')
  const [keywords, setKeywords] = useState(post?.keywords ?? '')

  // Insertion de lien externe (formulaire en ligne)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [mode, setMode] = useState<PubMode>(() => initialMode(post))
  const [scheduleAt, setScheduleAt] = useState<string>(() =>
    post?.published && post.published_at && new Date(post.published_at).getTime() > Date.now()
      ? isoToLocalInput(post.published_at)
      : defaultScheduleLocal(),
  )

  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  async function uploadFile(file: File): Promise<string> {
    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: upErr } = await supabase.storage.from('blog-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (upErr) throw new Error(upErr.message)
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploadingCover(true)
    try {
      setCoverUrl(await uploadFile(file))
    } catch (err) {
      setError(`Upload impossible : ${err instanceof Error ? err.message : 'erreur'}`)
    } finally {
      setUploadingCover(false)
      e.target.value = ''
    }
  }

  const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploadingInline(true)
    try {
      const url = await uploadFile(file)
      const snippet = `\n\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n\n`
      setBody((b) => b + snippet)
    } catch (err) {
      setError(`Upload impossible : ${err instanceof Error ? err.message : 'erreur'}`)
    } finally {
      setUploadingInline(false)
      e.target.value = ''
    }
  }

  /** Insère un fragment de texte à la position du curseur dans le corps. */
  const insertIntoBody = (snippet: string) => {
    const ta = bodyRef.current
    if (!ta) {
      setBody((b) => b + snippet)
      return
    }
    const start = ta.selectionStart ?? body.length
    const end = ta.selectionEnd ?? body.length
    const next = body.slice(0, start) + snippet + body.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + snippet.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const insertLink = () => {
    const url = linkUrl.trim()
    if (!url) return
    const text = linkText.trim() || url
    insertIntoBody(`[${text}](${url})`)
    setLinkText('')
    setLinkUrl('')
    setLinkOpen(false)
  }

  /** Insère un lien vers un autre article publié : [titre](/blog/slug). */
  const insertArticleLink = (slug: string) => {
    const p = linkablePosts.find((x) => x.slug === slug)
    if (!p) return
    insertIntoBody(`[${p.title}](/blog/${p.slug})`)
  }

  const save = () => {
    setError(null)

    // Détermine l'état de diffusion à partir du mode choisi.
    let publishedFlag = true
    let publishedAtIso: string
    if (mode === 'draft') {
      publishedFlag = false
      publishedAtIso = post?.published_at ?? new Date().toISOString()
    } else if (mode === 'schedule') {
      const when = new Date(scheduleAt)
      if (!scheduleAt || isNaN(when.getTime())) {
        setError('Choisissez une date et une heure de programmation valides.')
        return
      }
      if (when.getTime() <= Date.now()) {
        setError('La date de programmation doit être dans le futur.')
        return
      }
      publishedFlag = true
      publishedAtIso = when.toISOString()
    } else {
      // Publication immédiate. Conserve la date d'origine si déjà en ligne,
      // sinon horodate maintenant.
      publishedFlag = true
      const alreadyLive =
        !!post?.published && !!post.published_at && new Date(post.published_at).getTime() <= Date.now()
      publishedAtIso = alreadyLive ? post!.published_at : new Date().toISOString()
    }

    const input: BlogPostInput = {
      title,
      slug: slug || undefined,
      excerpt: excerpt || undefined,
      body,
      cover_image_url: coverUrl || null,
      category: category || null,
      badge: badge.trim() || null,
      keywords: keywords.trim() || null,
      published: publishedFlag,
      published_at: publishedAtIso,
    }
    startTransition(async () => {
      try {
        if (post) await updatePostAction(post.id, input)
        else await createPostAction(input)
        router.push('/admin/blog')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de sauvegarde')
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* Barre d'actions */}
      <div className="admin-card flex flex-wrap items-center justify-between gap-3 !py-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Diffusion : publier maintenant, programmer une date, ou brouillon. */}
          <div className="inline-flex rounded-lg border border-[var(--color-ink-line)] overflow-hidden">
            {([
              { m: 'now', label: 'Publier', Icon: Eye },
              { m: 'schedule', label: 'Programmer', Icon: Clock },
              { m: 'draft', label: 'Brouillon', Icon: EyeOff },
            ] as const).map(({ m, label, Icon }) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 transition-colors ${
                  mode === m
                    ? 'bg-[var(--color-gold)] text-[#1a1a1a] font-medium'
                    : 'text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
          {mode === 'schedule' && (
            <input
              type="datetime-local"
              value={scheduleAt}
              min={defaultScheduleLocal()}
              onChange={(e) => setScheduleAt(e.target.value)}
              className="tunnel-input text-sm !py-2"
              title="Date et heure de mise en ligne automatique"
            />
          )}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="tunnel-input text-sm !py-2">
            <option value="">— Catégorie —</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug (auto)"
            className="tunnel-input text-sm font-mono !py-2 w-40"
          />
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button type="button" onClick={save} disabled={pending} className="btn-gold text-xs px-4 py-2">
            {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {pending
              ? 'Enregistrement…'
              : mode === 'schedule'
              ? 'Programmer'
              : mode === 'draft'
              ? 'Enregistrer le brouillon'
              : 'Publier'}
          </button>
        </div>
      </div>

      {/* Éditeur (gauche) + Aperçu en direct (droite) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-5">
          <div className="admin-card space-y-4">
            <Field label="Titre">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Comment financer son cabinet médical ?"
                className="tunnel-input w-full text-lg"
              />
            </Field>
            <Field label="Chapô / extrait">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Résumé affiché dans la liste et en tête d'article."
                className="tunnel-input w-full resize-y text-sm leading-relaxed"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Badge (étiquette sur la carte)">
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="ex. Nouveau · Guide · À la une"
                  maxLength={24}
                  className="tunnel-input w-full text-sm"
                />
              </Field>
              <Field label="Mots-clés (pour l’assistant / chatbot)">
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="ex. financement cabinet médical, prêt professionnel santé"
                  className="tunnel-input w-full text-sm"
                />
              </Field>
            </div>
            <p className="text-[11px] text-[var(--color-cream-mute)] -mt-1">
              Le badge s’affiche en haut à droite de la carte sur le blog public. Les mots-clés
              (séparés par des virgules) permettent à l’assistant du site de recommander cet article.
            </p>
          </div>

          <div className="admin-card space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="eyebrow eyebrow--single">Contenu de l’article</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] cursor-pointer transition-colors">
                  {uploadingInline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                  Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleInlineImage} disabled={uploadingInline} />
                </label>
                <button
                  type="button"
                  onClick={() => setLinkOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" /> Insérer un lien
                </button>
                {linkablePosts.length > 0 && (
                  <label className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] cursor-pointer transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) insertArticleLink(e.target.value)
                        e.target.value = ''
                      }}
                      className="bg-transparent border-none text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-gold-soft)] focus:outline-none cursor-pointer"
                      title="Lier un autre article publié"
                    >
                      <option value="">Lier un article</option>
                      {linkablePosts.map((p) => (
                        <option key={p.id} value={p.slug} className="normal-case tracking-normal text-[var(--color-foreground)]">
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>

            {linkOpen && (
              <div className="rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink-soft)] p-3 flex flex-wrap items-end gap-2.5">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-cream-mute)] mb-1">Texte du lien</label>
                  <input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="ex. notre méthode" className="tunnel-input w-full text-sm !py-1.5" />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-cream-mute)] mb-1">URL (https:// ou /page)</label>
                  <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertLink() } }} placeholder="https://exemple.fr" className="tunnel-input w-full text-sm font-mono !py-1.5" />
                </div>
                <button type="button" onClick={insertLink} disabled={!linkUrl.trim()} className="btn-gold text-xs px-3 py-2 disabled:opacity-40">Insérer</button>
                <button type="button" onClick={() => setLinkOpen(false)} className="text-xs px-2 py-2 text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]">Annuler</button>
              </div>
            )}

            <textarea
              ref={bodyRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={18}
              placeholder={'Rédigez ici.\n\n## Un sous-titre\n\nUn paragraphe. **Gras** et [un lien](https://exemple.fr).\n\n- Une puce\n- Une autre\n\n> Une citation\n\nLes images insérées apparaissent en ![texte](url).'}
              className="tunnel-input w-full resize-y font-mono text-sm leading-relaxed"
            />
            <p className="text-[11px] text-[var(--color-cream-mute)]">
              Mise en forme : <code>## titre</code>, <code>### sous-titre</code>, <code>**gras**</code>,{' '}
              <code>- liste</code>, <code>&gt; citation</code>, <code>[lien](url)</code>, images via le bouton.
            </p>
          </div>

          <div className="admin-card space-y-3">
            <h2 className="eyebrow eyebrow--single">Image de couverture</h2>
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Couverture" className="w-full rounded-lg border border-[var(--color-ink-line)]" />
            ) : (
              <div className="w-full aspect-[16/10] rounded-lg border border-dashed border-[var(--color-ink-line)] flex items-center justify-center text-[var(--color-cream-mute)] text-xs">
                Aucune image
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] cursor-pointer transition-colors">
                {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                {coverUrl ? 'Remplacer' : 'Téléverser'}
                <input type="file" accept="image/*" className="hidden" onChange={handleCover} disabled={uploadingCover} />
              </label>
              {coverUrl && (
                <button type="button" onClick={() => setCoverUrl('')} className="text-xs text-[var(--color-cream-mute)] hover:text-red-600">
                  Retirer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Aperçu en direct */}
        <div className="xl:sticky xl:top-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] mb-2.5">
            Aperçu en direct · blog public
          </p>
          <BlogPreview title={title} excerpt={excerpt} body={body} coverUrl={coverUrl} category={category} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">{label}</label>
      {children}
    </div>
  )
}
