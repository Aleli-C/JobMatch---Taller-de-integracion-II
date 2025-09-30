// app/(shared)/logout/actions.ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const store = await cookies();          // Next 15: async
  store.delete("authToken");              // ← borra tu cookie real
  // opcional: si tuviste otra antes
  store.delete("session");
  redirect("/auth/login");                // corta la ejecución
}
