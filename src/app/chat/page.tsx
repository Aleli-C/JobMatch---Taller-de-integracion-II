"use client";

import ChatSidebar from "../../components/ChatSideBar";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ChatSidebar />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Selecciona un chat para abrirlo (aún no implementado).</p>
      </main>
    </div>
  );
}
