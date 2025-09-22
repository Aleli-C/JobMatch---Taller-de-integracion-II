"use server";
export const runtime = "nodejs";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import nodemailer, { type Transporter } from "nodemailer";

const requestResetSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const RESET_TTL_MIN = 15;

function sha256Hex(v: string) {
  return createHash("sha256").update(v).digest("hex");
}

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

// ---------- SMTP (singleton) ----------
declare global {
  // eslint-disable-next-line no-var
  var __mailer: Transporter | undefined;
}

function getTransporter(): Transporter {
  if (global.__mailer) return global.__mailer;
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  global.__mailer = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return global.__mailer;
}

function resetEmailHtml(url: string) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.4;color:#111">
    <h2>Recupera tu contraseña</h2>
    <p>Solicitaste restablecer tu contraseña. Haz clic en el botón para continuar.</p>
    <p><a href="${url}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#111;color:#fff;text-decoration:none">Restablecer contraseña</a></p>
    <p>O copia y pega este enlace en tu navegador:<br/><a href="${url}">${url}</a></p>
    <p style="color:#555">Este enlace expira en ${RESET_TTL_MIN} minutos. Si no fuiste tú, ignora este correo.</p>
  </div>`;
}

export async function SendResetEmail(to: string, url: string): Promise<void> {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || "no-reply@localhost";
  const subject = "Recupera tu contraseña";
  const text = `Para restablecer tu contraseña, abre: ${url}
Este enlace expira en ${RESET_TTL_MIN} minutos. Si no fuiste tú, ignora este correo.`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: resetEmailHtml(url),
  });
}

// ----------------- Actions -----------------
export type RequestPasswordResetState = { ok: true } | { ok: false; error: string };

export async function requestPasswordResetAction(
  _prev: RequestPasswordResetState,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const parsed = requestResetSchema.safeParse({ email: String(formData.get("email") || "") });
  if (!parsed.success) return { ok: false, error: "Email inválido" };

  const { email } = parsed.data;
  const user = await prisma.usuario.findUnique({ where: { correo: email }, select: { id: true, correo: true } });

  // Respuesta constante (no enumeración)
  if (!user) return { ok: true };

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

  //Se crea un token seguro y se guarda su hash en la base de datos
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256Hex(rawToken); 
  const expiresAt = new Date(Date.now() + RESET_TTL_MIN * 60 * 1000); // El token expira en 15 minutos, lo que mejora la seguridad

  await prisma.passwordResetToken.create({
    data: { userId: user.id, email: user.correo, tokenHash, expiresAt },
  });

  const url = `${appUrl()}/auth/reset?token=${rawToken}`;
  try {
    await SendResetEmail(user.correo, url);
  } catch (err) {
    console.error("Error enviando reset email:", err);
  }

  return { ok: true };
}

export async function requestPasswordReset(input: { email: string }): Promise<void> {
  const parsed = requestResetSchema.parse(input);
  const user = await prisma.usuario.findUnique({ where: { correo: parsed.email }, select: { id: true, correo: true } });
  if (!user) return;

  // Invalidas los tokens anteriores no utilizados al solicitar uno nuevo (para evitar múltiples tokens válidos)
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TTL_MIN * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, email: user.correo, tokenHash, expiresAt },
  });

  const url = `${appUrl()}/auth/reset?token=${rawToken}`;
  await SendResetEmail(user.correo, url);
}
