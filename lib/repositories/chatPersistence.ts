import { prisma } from "@/lib/prisma";
import { Mensaje, Chat } from "@prisma/client";

interface NewMessageData {
  chatId: number;
  remitenteId: number;
  destinatarioId: number;
  contenido: string;
}

/**
 * Guarda un nuevo mensaje en la base de datos.
 */
export async function saveMessage(data: NewMessageData): Promise<Mensaje> {
  try {
    return await prisma.mensaje.create({
      data: {
        chatId: data.chatId,
        remitenteId: data.remitenteId,
        destinatarioId: data.destinatarioId,
        contenido: data.contenido,
      },
    });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    throw new Error("No se pudo guardar el mensaje.");
  }
}

/**
 * Obtiene todos los mensajes de un chat específico, ordenados por fecha de envío.
 */
export async function getMessagesByChatId(chatId: number): Promise<Mensaje[]> {
  try {
    return await prisma.mensaje.findMany({
      where: { chatId },
      orderBy: { enviadoEn: "asc" },
      include: {
        remitente: {
          select: { id: true, nombre: true },
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener mensajes del chat ${chatId}:`, error);
    throw new Error("No se pudieron obtener los mensajes.");
  }
}

/**
 * Obtiene todos los chats en los que participa un usuario.
 */
export async function getChatsByUserId(userId: number): Promise<Chat[]> {
  try {
    return await prisma.chat.findMany({
      where: {
        OR: [{ usuario1Id: userId }, { usuario2Id: userId }],
      },
      include: {
        usuario1: { select: { id: true, nombre: true } },
        usuario2: { select: { id: true, nombre: true } },
        mensajes: {
          orderBy: { enviadoEn: "desc" },
          take: 1, // último mensaje
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener chats del usuario ${userId}:`, error);
    throw new Error("No se pudieron obtener los chats.");
  }
}

/**
 * Busca un chat existente entre dos usuarios o crea uno nuevo si no existe.
 */
export async function findOrCreateChat(userId1: number, userId2: number): Promise<Chat> {
  try {
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { usuario1Id: userId1, usuario2Id: userId2 },
          { usuario1Id: userId2, usuario2Id: userId1 },
        ],
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          usuario1Id: userId1,
          usuario2Id: userId2,
        },
      });
    }

    return chat;
  } catch (error) {
    console.error("Error al buscar o crear el chat:", error);
    throw new Error("No se pudo iniciar el chat.");
  }
}
