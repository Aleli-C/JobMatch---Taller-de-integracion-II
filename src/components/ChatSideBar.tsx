"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ChatItem = {
  id: number;
  name: string;
  lastMessage: string;
  fecha: string;
};

const MOCK: ChatItem[] = [
  { id: 1, name: "Ricardo López", lastMessage: "Hola Ricardo te dejo la información que pediste sobre la oferta.", fecha: new Date().toISOString() },
  { id: 2, name: "Ana García", lastMessage: "Entendido, gracias por confirmar. Te envío todo en la tarde.", fecha: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 3, name: "Carlos Ruiz", lastMessage: "Perfecto, nos vemos el miércoles para la clase.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 4, name: "Sofía Martínez", lastMessage: "¿Podrías enviarme tu portafolio cuando tengas un rato?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 5, name: "Javier Pérez", lastMessage: "Sí, el plazo de entrega es el viernes. Todo bien por aquí.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: 6, name: "Luis Torres", lastMessage: "Gracias por tu respuesta, coordinamos mañana.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
];

export default function ChatSidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>(MOCK);

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const initialsOf = (name: string) =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleSelectChat = (id: number) => {
    // 👑 1. Reordenar lista → chat clicado va arriba
    const selected = chats.find((c) => c.id === id);
    if (!selected) return;
    const newList = [selected, ...chats.filter((c) => c.id !== id)];
    setChats(newList);

    // 📡 2. Redirección comentada temporalmente
    // router.push(`/chat/${id}`);
  };

  return (
    <aside
      className="w-96 bg-gray-50 border-r border-gray-200 h-screen flex flex-col"
      style={{ minWidth: "384px" }}
    >
      {/* 🔸 Encabezado compacto */}
      <div className="px-5 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          Mensajes
        </h2>
      </div>

      {/* 🧭 Lista scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectChat(c.id)}
              className="w-full px-5 py-4 bg-white hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3 transition-colors text-left"
            >
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-semibold text-gray-600 text-sm flex-shrink-0">
                {initialsOf(c.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(c.fecha)}
                  </div>
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {c.lastMessage}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}