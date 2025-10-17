"use client";

import React from "react";

type ChatItemProps = {
  id?: number | string;
  name?: string;
  lastMessage?: string;
  fecha?: string; // ISO datetime
  unread?: number;
  className?: string;
  onClick?: (id?: number | string) => void;
  avatarBg?: string;
};

/**
 * ChatItem - single chat visual (único item).
 * Diseño idéntico al mock anterior. Reutilizable por un Sidebar/Parent.
 */
export function ChatItem({
  id,
  name = "Sin nombre",
  lastMessage = "",
  fecha,
  unread = 0,
  className = "",
  onClick,
  avatarBg = "bg-blue-100 text-blue-700",
}: ChatItemProps) {
  const initials = (name || "")
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const time = (() => {
    if (!fecha) return "";
    try {
      const d = new Date(fecha);
      return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  })();

  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className={`w-full h-16 rounded-xl bg-white/95 dark:bg-gray-200/90 ring-1 ring-gray-200 dark:ring-gray-200 flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left ${className}`}
      aria-label={`Abrir chat con ${name}`}
    >
      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-medium flex-shrink-0 ${avatarBg}`}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800 dark:text-black-400 truncate">
            {name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">{time}</div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          {lastMessage}
        </div>
      </div>
    </button>
  );
}

/* --- Mock list (preview) - export default para ver varios items en la UI --- */
type MockItem = { id: number; name: string; lastMessage: string; fecha: string; unread?: number; avatarBg?: string };

const MOCK: MockItem[] = [
  { id: 1, name: "Ricardo López", lastMessage: "Hola Ricardo te dejo la información que pediste sobre la oferta.", fecha: new Date().toISOString(), avatarBg: "bg-emerald-100 text-emerald-700" },
  { id: 2, name: "Ana García", lastMessage: "Entendido, gracias por confirmar. Te envío todo en la tarde.", fecha: new Date(Date.now() - 1000 * 60 * 60).toISOString(), unread: 2, avatarBg: "bg-cyan-100 text-cyan-700" },
  { id: 3, name: "Carlos Ruiz", lastMessage: "Perfecto, nos vemos el miércoles para la clase.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), avatarBg: "bg-yellow-100 text-yellow-700" },
  { id: 4, name: "Sofía Martínez", lastMessage: "¿Podrías enviarme tu portafolio?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), unread: 1, avatarBg: "bg-pink-100 text-pink-700" },
  { id: 5, name: "Javier Pérez", lastMessage: "Sí, el plazo de entrega es el viernes.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), avatarBg: "bg-indigo-100 text-indigo-700" },
  { id: 6, name: "Alberto Caro", lastMessage: "Si no estudias, estas frito!!.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), avatarBg: "bg-indigo-100 text-indigo-700" },
];

export default function Chat({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {MOCK.slice(0, count).map((m) => (
        <ChatItem
          key={m.id}
          id={m.id}
          name={m.name}
          lastMessage={m.lastMessage}
          fecha={m.fecha}
          unread={m.unread}
          avatarBg={m.avatarBg}
        />
      ))}
    </div>
  );
}