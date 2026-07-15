'use server'

import { revalidatePath } from 'next/cache'
import { assertAdminSession } from '@/lib/admin/session'
import { approvePasskey, deletePasskey } from '@/lib/admin/passkeys'

export async function approvePasskeyAction(id: string): Promise<void> {
  await assertAdminSession()
  await approvePasskey(id)
  revalidatePath('/admin/parametres')
}

export async function deletePasskeyAction(id: string): Promise<void> {
  await assertAdminSession()
  await deletePasskey(id)
  revalidatePath('/admin/parametres')
}
