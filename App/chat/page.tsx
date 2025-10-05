// app/chat/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/getSessionUser";
import { getChats } from "@/lib/usecases/getChats";
import { UIChat } from "@/lib/types/chat-ui";
import ChatSidebar from "@/components/ChatSideBar";

// Componente cliente para manejar la navegación entre chats
function SidebarClient({
  chats,
  activeChatId,
}: {
  chats: UIChat[];
  activeChatId: string | null;
}) {
  "use client";

  // Importamos el hook solo dentro del componente cliente
  const { useRouter } = require("next/navigation");
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
  // Este es un Server Component
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");

  // Llamamos al caso de uso que obtiene los chats desde la BD
  const sidebarChats: UIChat[] = await getChats(session.id);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Panel lateral de chats */}
      <SidebarClient chats={sidebarChats} activeChatId={null} />

      {/* Panel principal con mensaje de bienvenida */}
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
