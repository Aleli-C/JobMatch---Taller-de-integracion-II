"use client";

import React from "react";

type Props = {
  count?: number;       // cuántos rectángulos renderizar
  className?: string;   // clases adicionales en el contenedor
};

/**
 * Chat (visual-only)
 * - Solo renderiza los rectángulos/placeholder donde irá la info del chat.
 * - No hace fetch ni maneja ids.
 */
export default function Chat({ count = 5, className = "" }: Props) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full h-16 rounded-xl bg-white/95 dark:bg-gray-200/90 ring-1 ring-gray-200 dark:ring-gray-200/90 flex items-center gap-3 p-3"
        >
          {/* avatar placeholder */}
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-400 flex-shrink-0" />

          {/* text placeholders */}
          <div className="flex-1 min-w-0">
            <div className="h-4 w-3/5 rounded-md bg-gray-100 dark:bg-gray-400 mb-2" />
            <div className="h-3 w-2/3 rounded-md bg-gray-100 dark:bg-gray-400" />
          </div>

          {/* date / time placeholder */}
          <div className="h-3 w-14 rounded-md bg-gray-100 dark:bg-gray-400 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}