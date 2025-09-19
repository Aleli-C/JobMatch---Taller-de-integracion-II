//lib/getSessionUser.ts
import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

type SessionPayload = {
  id: number;
  correo: string;
  tipo: string;
  iat: number;
  exp: number;
};

export async function getSessionUser() {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  const user = verifyJWT<SessionPayload>(token);
  return user;
}
