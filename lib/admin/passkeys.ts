import { createServerClient } from '@supabase/ssr'

/**
 * Accès à la table `admin_passkeys` (empreintes WebAuthn).
 * Utilise la clé service_role (contourne la RLS) — table sensible, accès
 * strictement serveur.
 */

export interface Passkey {
  id: string
  created_at: string
  email: string
  label: string | null
  credential_id: string
  public_key: string
  counter: number
  transports: string | null
  status: 'pending' | 'approved'
}

function db() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}

export async function listPasskeys(): Promise<Passkey[]> {
  try {
    const { data, error } = await db()
      .from('admin_passkeys')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return []
    return (data ?? []) as Passkey[]
  } catch {
    return []
  }
}

export async function listApprovedPasskeys(): Promise<Passkey[]> {
  try {
    const { data, error } = await db().from('admin_passkeys').select('*').eq('status', 'approved')
    if (error) return []
    return (data ?? []) as Passkey[]
  } catch {
    return []
  }
}

export async function getPasskeyByCredentialId(credentialId: string): Promise<Passkey | null> {
  const { data, error } = await db()
    .from('admin_passkeys')
    .select('*')
    .eq('credential_id', credentialId)
    .maybeSingle()
  if (error || !data) return null
  return data as Passkey
}

export async function insertPasskey(
  row: {
    email: string
    label: string
    credential_id: string
    public_key: string
    counter: number
    transports: string | null
  },
  status: 'pending' | 'approved' = 'pending',
): Promise<void> {
  const { error } = await db().from('admin_passkeys').insert({ ...row, status })
  if (error) throw new Error(error.message)
}

export async function setPasskeyCounter(credentialId: string, counter: number): Promise<void> {
  await db().from('admin_passkeys').update({ counter }).eq('credential_id', credentialId)
}

export async function approvePasskey(id: string): Promise<void> {
  const { error } = await db().from('admin_passkeys').update({ status: 'approved' }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deletePasskey(id: string): Promise<void> {
  const { error } = await db().from('admin_passkeys').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
