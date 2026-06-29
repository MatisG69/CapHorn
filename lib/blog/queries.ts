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
    .single()
  if (error) return null
  return data as BlogPost
}

/** Tous les articles (admin — inclut les brouillons non publiés). */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false })
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
