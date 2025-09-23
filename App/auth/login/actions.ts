'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type LoginActionState = {
  formError?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * useActionState => (prevState, formData) => Promise<State>
 * En éxito: redirect('/home') (never), por lo tanto NO retornamos void.
 */
export async function loginUser(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const correo = String(formData.get('correo') ?? '')
  const contrasena = String(formData.get('contrasena') ?? '')

  // TODO: valida credenciales; si falla:
  if (!correo || !contrasena) {
    return { formError: 'Credenciales inválidas' }
  }

  // Éxito: set cookie en Server Action y redirige
  const jar = await cookies()
  jar.set('session', 'TOKEN_FIRMADO', {
    httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 7
  }) // set cookie en Server Action, como indica la doc. :contentReference[oaicite:2]{index=2}

  redirect('/home') // permitido en Server Actions. :contentReference[oaicite:3]{index=3}
}
