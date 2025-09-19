import React, { useState } from "react";
import { Spinner } from "../components/Spinner";
import { registerUser } from "@/app/auth/register/actions";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsLoading(true);
    const result = await registerUser(formData);
    setIsLoading(false);

    if (result.success) {
      alert("Usuario registrado!");
    } else {
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs de registro */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size={20} /> : "Registrar"}
      </button>
    </form>
  );
};
