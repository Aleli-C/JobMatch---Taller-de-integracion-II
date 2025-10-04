// App/chat/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/getSessionUser";
import { getChatsByUserId, ChatDb } from "@/lib/repositories/chatPersistence";
import ChatSidebar from "@/components/ChatSideBar";
import { useRouter } from "next/navigation";

// Tipos de UI
type UIMessage = { text: string; senderId: string; time: string };
type UIChatUser = { name: string; about: string; contact: string; avatar: string };
type UIChat = { id: string; user: UIChatUser; messages: UIMessage[] };

// Pequeño wrapper cliente para manejar navegación
function SidebarClient({ chats, activeChatId }: { chats: UIChat[]; activeChatId: string | null }) {
  "use client";
  const router = useRouter();
  return (
    <ChatSidebar
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => router.push(`/chat/${id}`)}
    />
  );
}

export default async function MisChatsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");

  const chatsDb: ChatDb[] = await getChatsByUserId(session.id);

  const sidebarChats: UIChat[] = chatsDb.map((c) => {
    const other = c.usuario1Id === session.id ? c.usuario2 : c.usuario1;
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <SidebarClient chats={sidebarChats} activeChatId={null} />
      <main className="flex-1 flex-col items-center justify-center p-6 hidden md:flex">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Bienvenido a tus Chats
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Selecciona una conversación de la lista para empezar a chatear.
          </p>
        </div>
      </main>
    </div>
  );
}
