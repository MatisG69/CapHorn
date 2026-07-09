import { createClient } from '../supabase/server'
import type { BlogPost } from '../types'

/** Articles publiés, du plus récent au plus ancien (site public).
 *  Résilient : si la table n'existe pas encore (SQL non exécuté) ou si
 *  Supabase n'est pas configuré, on renvoie une liste vide plutôt qu'une 500. */
export async function getPublishedPosts(category?: string): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .is('deleted_at', null)
      // Les articles programmés (published_at dans le futur) restent masqués
      // jusqu'à leur date de mise en ligne. Les pages étant `force-dynamic`,
      // `now()` est réévalué à chaque requête : l'article apparaît tout seul.
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) return []
    return (data ?? []) as BlogPost[]
  } catch {
    return []
  }
}

/** Article publié par slug (site public). null si introuvable / non publié. */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    // Un article programmé (published_at futur) reste introuvable → notFound().
    .lte('published_at', new Date().toISOString())
    .single()
  if (error) return null
  return data as BlogPost
}

/** Articles actifs (admin : brouillons inclus, corbeille exclue). */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
    if (error) return []
    return (data ?? []) as BlogPost[]
  } catch {
    return []
  }
}

/** Articles dans la corbeille (admin), du plus récemment supprimé au plus ancien. */
export async function getTrashedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
    if (error) return []
    return (data ?? []) as BlogPost[]
  } catch {
    return []
  }
}

/** Article par id (admin éditeur). */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data as BlogPost
}

/** Transforme un titre en slug d'URL stable. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritiques / accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
