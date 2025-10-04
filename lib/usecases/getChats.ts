// lib/usecases/getChats.ts
import "server-only";
import { getChatsByUserId, ChatDb } from "@/lib/repositories/chatPersistence";
import { UIChat } from "@/lib/types/chat-ui";

/**
 * Obtiene los chats de un usuario y los transforma al formato de UI
 */
export async function getChats(userId: number): Promise<UIChat[]> {
  const chatsDb: ChatDb[] = await getChatsByUserId(userId);

  return chatsDb.map((c) => {
    const other = c.usuario1Id === userId ? c.usuario2 : c.usuario1;
    const last = c.mensajes?.[0];

    return {
      id: String(c.id),
      user: {
        name: other?.nombre ?? "Usuario",
        about: other?.perfil?.experiencia ?? "",
        contact: other?.correo ?? "",
        avatar: other?.perfil?.foto ?? "/avatar-placeholder.png",
      },
      messages: last
        ? [
            {
              text: last.contenido,
              senderId: String(last.remitenteId),
              time: new Date(last.enviadoEn).toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]
        : [],
    };
  });
}
