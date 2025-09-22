// /lib/jwt.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? process.env.JWT_SECRET ?? "dev_secret_change_me"
);

// Firma genérica. Úsala en Server Actions, no en middleware.
export async function signJWT(payload: JWTPayload, exp: string = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

// Verificación Edge-safe. Úsala en middleware.
export async function verifyJWT<T extends JWTPayload = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}
