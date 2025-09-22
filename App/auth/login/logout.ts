// app/auth/login/logout.ts
"use server";

import { cookies } from "next/headers";
import { sessionConfig } from "../../../lib/session";

export async function logoutUser() {
  (await cookies()).set(sessionConfig.name, "", {
    ...sessionConfig.options,
    maxAge: 0, // expira inmediatamente
  });

  return { success: true };
}
