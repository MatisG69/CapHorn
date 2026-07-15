'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import { slugify } from '@/lib/blog/queries'

export interface BlogPostInput {
  title: string
  slug?: string
  excerpt?: string
  body: string
  cover_image_url?: string | null
  category?: string | null
  published: boolean
  /** Date/heure de mise en ligne (ISO). Dans le futur = article programmé,
   *  il apparaîtra automatiquement sur le site public à cette date. */
  published_at?: string | null
  /** Étiquette (badge) affichée sur les cartes du blog public. */
  badge?: string | null
  /** Mots-clés (virgules) pour la connaissance du chatbot. */
  keywords?: string | null
}

/** Colonnes optionnelles (ajoutées via blog_schema.sql). Si elles n'existent
 *  pas encore dans la base, on réessaie l'écriture sans elles pour ne rien casser. */
const OPTIONAL_COLUMNS = ['badge', 'keywords'] as const

function isMissingOptionalColumn(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false
  return err.code === 'PGRST204' || err.code === '42703' || /\b(badge|keywords)\b/.test(err.message ?? '')
}

/** Garantit un slug unique (ajoute -2, -3… en cas de collision). */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = slugify(base) || 'article'
  let candidate = root
  let n = 1
  // Boucle bornée, au pire quelques itérations.
  for (let i = 0; i < 50; i++) {
    const { data } = await supabase.from('blog_posts').select('id').eq('slug', candidate).maybeSingle()
    if (!data || data.id === excludeId) return candidate
    n += 1
    candidate = `${root}-${n}`
  }
  return `${root}-${Date.now()}`
}

export async function createPostAction(input: BlogPostInput): Promise<{ id: string; slug: string }> {
  await assertAdminSession()
  if (!input.title.trim()) throw new Error('Le titre est requis')
  const supabase = await createClient()
  const slug = await uniqueSlug(supabase, input.slug?.trim() || input.title)

  const row: Record<string, unknown> = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt?.trim() || null,
    body: input.body ?? '',
    cover_image_url: input.cover_image_url || null,
    category: input.category || null,
    badge: input.badge?.trim() || null,
    keywords: input.keywords?.trim() || null,
    published: input.published,
    published_at: input.published_at || new Date().toISOString(),
  }

  let { data, error } = await supabase.from('blog_posts').insert(row).select('id, slug').single()
  if (error && isMissingOptionalColumn(error)) {
    for (const k of OPTIONAL_COLUMNS) delete row[k]
    ;({ data, error } = await supabase.from('blog_posts').insert(row).select('id, slug').single())
  }
  if (error || !data) throw new Error(error?.message ?? 'Erreur d’enregistrement')

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${data.slug}`)
  return { id: data.id, slug: data.slug }
}

export async function updatePostAction(id: string, input: BlogPostInput): Promise<{ slug: string }> {
  await assertAdminSession()
  if (!input.title.trim()) throw new Error('Le titre est requis')
  const supabase = await createClient()
  const slug = await uniqueSlug(supabase, input.slug?.trim() || input.title, id)

  const patch: Record<string, unknown> = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt?.trim() || null,
    body: input.body ?? '',
    cover_image_url: input.cover_image_url || null,
    category: input.category || null,
    badge: input.badge?.trim() || null,
    keywords: input.keywords?.trim() || null,
    published: input.published,
  }
  // Ne met à jour la date de mise en ligne que si l'éditeur en fournit une
  // (publication immédiate ou programmation), jamais écrasée par null.
  if (input.published_at) patch.published_at = input.published_at

  let { data, error } = await supabase.from('blog_posts').update(patch).eq('id', id).select('slug').single()
  if (error && isMissingOptionalColumn(error)) {
    for (const k of OPTIONAL_COLUMNS) delete patch[k]
    ;({ data, error } = await supabase.from('blog_posts').update(patch).eq('id', id).select('slug').single())
  }
  if (error || !data) throw new Error(error?.message ?? 'Erreur d’enregistrement')

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${data.slug}`)
  return { slug: data.slug }
}

/** Met l'article à la corbeille (soft delete) — restaurable. */
export async function deletePostAction(id: string): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  revalidatePath('/admin/blog/corbeille')
}

/** Restaure un article depuis la corbeille. */
export async function restorePostAction(id: string): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({ deleted_at: null })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  revalidatePath('/admin/blog/corbeille')
}

/** Supprime définitivement un article (depuis la corbeille) — irréversible. */
export async function permanentlyDeletePostAction(id: string): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog/corbeille')
}
