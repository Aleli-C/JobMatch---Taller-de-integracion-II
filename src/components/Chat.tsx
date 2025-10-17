"use client";

import React from "react";

type Props = {
  count?: number;       // cuántos items mostrar (limita el mock)
  className?: string;
};

type ChatItem = {
  id: number;
  name: string;
  lastMessage: string;
  fecha: string; // ISO
};

const MOCK: ChatItem[] = [
  { id: 1, name: "Ricardo López", lastMessage: "Hola Ricardo te dejo la información que pediste sobre la oferta.", fecha: new Date().toISOString() },
  { id: 2, name: "Ana García", lastMessage: "Entendido, gracias por confirmar. Te envío todo en la tarde.", fecha: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 3, name: "Carlos Ruiz", lastMessage: "Perfecto, nos vemos el miércoles para la clase.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 4, name: "Sofía Martínez", lastMessage: "¿Podrías enviarme tu portafolio cuando tengas un rato?", fecha: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 5, name: "Javier Pérez", lastMessage: "Sí, el plazo de entrega es el viernes. Todo bien por aquí.", fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

export default function Chat({ count = 5, className = "" }: Props) {
  const items = MOCK.slice(0, count);

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

  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {items.map((c) => (
        <button
          key={c.id}
          className="w-full h-16 rounded-xl bg-white/95 dark:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          type="button"
          aria-label={`Chat con ${c.name}`}
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
            {initialsOf(c.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {c.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formatTime(c.fecha)}
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {c.lastMessage}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}