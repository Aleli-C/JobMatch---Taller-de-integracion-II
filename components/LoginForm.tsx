// components/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/auth/login/actions";

type LoginActionState = {
  ok: boolean;
  message?: string;
  formError?: string; // <- lo estás leyendo en el componente
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
};

const initialState: LoginActionState = { ok: false };

const LoginForm = () => {
  const [state, formAction, pending] = useActionState<LoginActionState, FormData>(
    // si tu server action no recibe `prev`, casteamos la firma:
    loginUser as unknown as (
      prev: LoginActionState,
      fd: FormData
    ) => Promise<LoginActionState>,
    initialState
  );

  const topError =
    state.formError ?? state.message ?? state.errors?.general?.[0];

  return (
    <form action={formAction}>
      {/* ...inputs... */}
      {topError && (
        <p className="text-sm text-red-600 mt-2">{topError}</p>
      )}
      <button disabled={pending}>Iniciar sesión</button>
    </form>
  );
};

export default LoginForm;
