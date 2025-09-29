// app/chat/[id]/page.tsx
import { getSessionUser } from "@/lib/getSessionUser";
import { redirect } from "next/navigation";
import { getMessagesByChatId, saveMessage } from "@/lib/repositories/chatPersistence";
import { revalidatePath } from "next/cache";

// Esto es un Server Action
async function handleSendMessage(formData: FormData) {
  "use server"; // IMPORTANTE para que corra en el servidor
  const contenido = formData.get("contenido")?.toString();
  const chatId = Number(formData.get("chatId"));
  const remitenteId = Number(formData.get("remitenteId"));
  const destinatarioId = Number(formData.get("destinatarioId"));

  if (!contenido?.trim()) return;

  await saveMessage({ chatId, remitenteId, destinatarioId, contenido });

  // Revalida esta página para que se vean los nuevos mensajes
  revalidatePath(`/chat/${chatId}`);
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");

  const chatId = Number(params.id);

  const messages = await getMessagesByChatId(chatId);

  // Identifica al otro usuario para saber a quién le escribes
  const destinatarioId =
    messages[0]?.remitenteId === session.id
      ? messages[0].destinatarioId
      : messages[0]?.remitenteId;

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold">Chat</h1>

        <div className="h-80 overflow-y-auto border rounded-lg p-4 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Aún no hay mensajes en este chat.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-lg ${
                  m.remitenteId === session.id
                    ? "bg-blue-500 text-white self-end text-right"
                    : "bg-gray-200 text-black self-start text-left"
                }`}
              >
                <p>{m.contenido}</p>
                <span className="text-xs opacity-70">
                  {new Date(m.enviadoEn).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Formulario para enviar mensaje */}
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
      </div>
    </main>
  );
}
