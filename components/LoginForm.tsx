// components/LoginForm.tsx
"use client";
import React, { useState } from "react";
import { Spinner } from "../components/Spinner";
import { loginUser, type LoginActionResult } from "@/app/auth/login/actions";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result: LoginActionResult = await loginUser(formData); // puede redirigir

    setIsLoading(false);

    if (result && "error" in result) {
      console.error(result.error);
      // muestra errores en UI
      return;
    }
    // Éxito: el redirect ya ocurrió en el servidor.
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size={20} /> : "Iniciar Sesión"}
      </button>
    </form>
  );
};
