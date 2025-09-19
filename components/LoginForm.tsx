import React, { useState } from "react";
import { Spinner } from "../components/Spinner";
import { loginUser } from "@/app/auth/login/actions";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsLoading(true);
    const result = await loginUser(formData);
    setIsLoading(false);

    if (result.success) {
      alert("Inicio de sesión exitoso!");
    } else {
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs de login */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size={20} /> : "Iniciar Sesión"}
      </button>
    </form>
  );
};
