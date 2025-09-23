'use client'
import { useActionState } from 'react'            // React 19
import { useFormStatus } from 'react-dom'
import { loginUser, type LoginActionState } from '@/app/auth/login/actions'
import { Spinner } from '@/components/Spinner'     // ajusta alias si no usas @

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? <Spinner size={20} /> : 'Iniciar Sesión'}
    </button>
  )
}

const initialState: LoginActionState = {}

export const LoginForm = () => {
  // Generics explícitos para evitar inferir unions raros
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    loginUser,
    initialState
  )

  return (
    <form action={formAction} className="space-y-4">
      <input name="correo" type="email" placeholder="correo@dominio.com" required />
      <input name="contrasena" type="password" placeholder="•••••••" required />
      {state?.formError && <p className="text-red-600">{state.formError}</p>}
      <SubmitBtn />
    </form>
  )
}
