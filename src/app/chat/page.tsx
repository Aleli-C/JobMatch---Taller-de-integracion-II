import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getChats } from "@/lib/usecases/getChats";
import { UIChat } from "@/lib/types/chat-ui";
import SidebarClient from "./Sidebar";

export default async function MisChatsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const userId = Number(session.sub);
  const sidebarChats: UIChat[] = await getChats(userId);

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
