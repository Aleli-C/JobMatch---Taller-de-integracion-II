"use client";
import React, { useState } from "react";

type Item = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    id: "personal",
    label: "Información",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "pendientes",
    label: "Pendientes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M7 21h10" />
      </svg>
    ),
  },
  {
    id: "favoritos",
    label: "Favoritos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" stroke="none">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
    ),
  },
  {
    id: "historial",
    label: "Historial",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ProfileSidebar() {
  const [active, setActive] = useState<string>(items[0].id);

  const handleClick = (id: string) => {
    setActive(id);
    // scroll to element with id if exists
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    // container: collapsed by default and expands on hover (lg only)
    <nav aria-label="Perfil navigation" className="hidden lg:block">
  <div className="group fixed left-6 top-56 z-30">
        {/* outer area matches page background (f3f4f6 -> bg-gray-100) and is slightly larger */}
        <div className="bg-gray-100 rounded-xl p-1 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-16 group-hover:w-72 transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-stretch">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => handleClick(it.id)}
                className={`flex items-center gap-3 px-3 py-4 w-full text-left hover:bg-gray-50 focus:outline-none transition-colors ${
                  active === it.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
                aria-current={active === it.id}
              >
                <div className="flex items-center justify-center w-10 h-10 text-blue-600">
                  {it.icon}
                </div>
                <span className="truncate text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {it.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
}
