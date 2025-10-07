// lib/repositories/chatPersistence.ts
import "server-only";
import { prisma } from "@/lib/prisma";

//Modelos simplificados solo con los campos necesarios
// para las operaciones de chat
export type UsuarioLigero = {
  id: number;
  nombre: string | null;
  correo: string | null;
  perfil?: {
    foto: string | null;
    experiencia: string | null;
  } | null;
};

export type MensajeDb = {
  contenido: string;
  remitenteId: number;
  enviadoEn: Date;
};

export type ChatDb = {
  id: number;
  creadoEn: Date;
  usuario1Id: number;
  usuario2Id: number;
  usuario1: UsuarioLigero;
  usuario2: UsuarioLigero;
  mensajes: MensajeDb[];
};

/**
 * Obtener todos los chats donde participa un usuario
 */
export async function getChatsByUserId(userId: number): Promise<ChatDb[]> {
  return prisma.chat.findMany({
    where: {
      OR: [{ usuario1Id: userId }, { usuario2Id: userId }],
    },
    include: {
      usuario1: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          perfil: { select: { foto: true, experiencia: true } },
        },
      },
      usuario2: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          perfil: { select: { foto: true, experiencia: true } },
        },
      },
      mensajes: {
        orderBy: { enviadoEn: "desc" },
        take: 1, // solo el último mensaje
        select: { contenido: true, remitenteId: true, enviadoEn: true },
      },
    },
    orderBy: {
      creadoEn: "desc", // no tienes updatedAt en tu esquema
    },
  });
}

/**
 * 🔹 Obtener todos los mensajes de un chat
 */
export async function getMessagesByChatId(chatId: number): Promise<MensajeDb[]> {
  return prisma.mensaje.findMany({
    where: { chatId },
    orderBy: { enviadoEn: "asc" },
    select: { contenido: true, remitenteId: true, enviadoEn: true },
  });
}

/**
 * 🔹 Buscar un chat existente entre dos usuarios o crearlo
 */
export async function findOrCreateChat(usuarioAId: number, usuarioBId: number) {
  const [minId, maxId] =
    usuarioAId < usuarioBId ? [usuarioAId, usuarioBId] : [usuarioBId, usuarioAId];

  const existente = await prisma.chat.findFirst({
    where: { usuario1Id: minId, usuario2Id: maxId },
    select: { id: true },
  });

  if (existente) return existente;

  return prisma.chat.create({
    data: { usuario1Id: minId, usuario2Id: maxId },
    select: { id: true },
  });
}

/**
 * 🔹 Guardar mensaje en la base de datos
 */
export async function saveMessage(args: {
  chatId: number;
  remitenteId: number;
  destinatarioId: number;
  contenido: string;
}) {
  const { chatId, remitenteId, destinatarioId, contenido } = args;

  await prisma.mensaje.create({
    data: { chatId, remitenteId, destinatarioId, contenido },
  });
}

// Obtener un chat completo (usuarios + todos los mensajes)
export async function getChatWithUsersAndMessages(chatId: number) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      usuario1: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          perfil: { select: { foto: true, experiencia: true } },
        },
      },
      usuario2: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          perfil: { select: { foto: true, experiencia: true } },
        },
      },
      mensajes: {
        orderBy: { enviadoEn: "asc" },
        select: { contenido: true, remitenteId: true, enviadoEn: true },
      },
    },
  });
}
