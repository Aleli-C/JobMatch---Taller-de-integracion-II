import { prisma } from "@/lib/prisma"; 
import { Mensaje, Chat } from "@prisma/client";

// Define una interfaz para los datos necesarios para crear un nuevo mensaje.
interface NewMessageData {
  chatId: number;
  remitenteId: number;
  destinatarioId: number;
  contenido: string;
}

/**
 * Guarda un nuevo mensaje en la base de datos.
 * @param data - Los datos del mensaje a guardar.
 * @returns El mensaje guardado.
 */
export async function saveMessage(data: NewMessageData): Promise<Mensaje> {
  try {
    const message = await prisma.mensaje.create({
      data: {
        chatId: data.chatId,
        remitenteId: data.remitenteId,
        destinatarioId: data.destinatarioId,
        contenido: data.contenido,
      },
    });
    return message;
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    // En un caso real, podrías lanzar un error más específico o manejarlo de otra forma.
    throw new Error('No se pudo guardar el mensaje.');
  }
}

/**
 * Obtiene todos los mensajes de un chat específico, ordenados por fecha de envío.
 * @param chatId - El ID del chat del que se quieren obtener los mensajes.
 * @returns Una lista de los mensajes del chat.
 */
export async function getMessagesByChatId(chatId: number): Promise<Mensaje[]> {
  try {
    const messages = await prisma.mensaje.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        enviadoEn: 'asc', // Ordena los mensajes del más antiguo al más reciente.
      },
      include: {
        remitente: { // Incluye información del remitente para mostrar en la UI.
          select: {
            id: true,
            nombre: true,
          }
        }
      }
    });
    return messages;
  } catch (error) {
    console.error(`Error al obtener los mensajes para el chat ${chatId}:`, error);
    throw new Error('No se pudieron obtener los mensajes.');
  }
}

/**
 * Busca un chat existente entre dos usuarios. Si no existe, crea uno nuevo.
 * Esto previene la creación de múltiples salas de chat para los mismos dos usuarios.
 * @param userId1 - El ID del primer usuario.
 * @param userId2 - El ID del segundo usuario.
 * @returns El chat existente o el recién creado.
 */
export async function findOrCreateChat(userId1: number, userId2: number): Promise<Chat> {
  try {
    // Busca un chat donde los dos usuarios ya estén participando.
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { usuario1Id: userId1, usuario2Id: userId2 },
          { usuario1Id: userId2, usuario2Id: userId1 },
        ],
      },
    });

    // Si no se encuentra un chat, crea uno nuevo.
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
    console.error('Error al buscar o crear el chat:', error);
    throw new Error('No se pudo iniciar el chat.');
  }
}
