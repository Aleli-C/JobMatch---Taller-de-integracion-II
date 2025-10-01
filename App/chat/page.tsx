// app/chat/page.tsx

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/getSessionUser";
import { getChatsByUserId } from "@/lib/repositories/chatPersistence";

// 1. Importamos el componente visual de la barra lateral
import ChatSidebar from "../../components/ChatSideBar";

export default async function MisChatsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");
  
  const chats = await getChatsByUserId(session.id);

  return (
    // 2. Aplicamos el layout principal a pantalla completa
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      
      {/* 3. Usamos el componente ChatSidebar para mostrar la lista de forma consistente */}
      {/* Le pasamos los chats, la sesión y un activeChatId nulo, ya que no hay ninguno activo */}
      <ChatSidebar chats={chats} session={session} activeChatId={null} />

      {/* 4. En el área principal, mostramos un mensaje de bienvenida */}
      {/* Este mensaje se oculta en pantallas pequeñas para dar prioridad a la lista de chats */}
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