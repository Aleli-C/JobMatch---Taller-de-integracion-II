// app/(shared)/logout/actions.ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  (await cookies()).delete('session')
  redirect('/auth/login')
}
