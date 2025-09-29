// app/chat/[conversationId]/page.tsx
import { getSessionUser } from "@/lib/getSessionUser";
import { redirect } from "next/navigation";
import {
  getMessagesByChatId,
  saveMessage,
  findOrCreateChat,
} from "@/lib/repositories/chatPersistence";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Server Action para enviar mensajes
async function handleSendMessage(formData: FormData) {
  "use server";

  const contenido = formData.get("contenido")?.toString();
  const chatId = Number(formData.get("chatId"));
  const remitenteId = Number(formData.get("remitenteId"));
  const destinatarioId = Number(formData.get("destinatarioId"));

  if (!contenido?.trim()) return;

  await saveMessage({ chatId, remitenteId, destinatarioId, contenido });

  // Revalida esta página para que aparezca el mensaje nuevo
  revalidatePath(`/chat/${chatId}`);
}

export default async function ChatPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");

  const chatId = Number(params.conversationId);

  // Obtenemos el chat con usuarios para identificar destinatario si no hay mensajes
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { usuario1: true, usuario2: true },
  });

  if (!chat) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <p className="text-center text-red-500">
          Este chat no existe o ha sido eliminado.
        </p>
      </main>
    );
  }

  const messages = await getMessagesByChatId(chatId);

  // Identificar destinatario:
  let destinatarioId: number | null = null;
  if (messages.length > 0) {
    destinatarioId =
      messages[0].remitenteId === session.id
        ? messages[0].destinatarioId
        : messages[0].remitenteId;
  } else {
    // Si no hay mensajes, deducirlo del chat
    destinatarioId =
      chat.usuario1.id === session.id ? chat.usuario2.id : chat.usuario1.id;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold">
          Conversación con{" "}
          {chat.usuario1.id === session.id
            ? chat.usuario2.nombre
            : chat.usuario1.nombre}
        </h1>

        {/* Historial de mensajes */}
        <div className="h-80 overflow-y-auto border rounded-lg p-4 space-y-2 flex flex-col">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Aún no hay mensajes en este chat.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-lg max-w-[70%] ${
                  m.remitenteId === session.id
                    ? "bg-blue-500 text-white self-end text-right"
                    : "bg-gray-200 text-black self-start text-left"
                }`}
              >
                <p>{m.contenido}</p>
                <span className="text-xs opacity-70 block">
                  {new Date(m.enviadoEn).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Formulario para enviar mensaje */}
        {destinatarioId && (
          <form action={handleSendMessage} className="flex gap-2">
            <input type="hidden" name="chatId" value={chatId} />
            <input type="hidden" name="remitenteId" value={session.id} />
            <input type="hidden" name="destinatarioId" value={destinatarioId} />

            <input
              type="text"
              name="contenido"
              className="border rounded p-2 flex-1"
              placeholder="Escribe un mensaje..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Enviar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
