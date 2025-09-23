// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/publications/publications_view", label: "Publicaciones" },
  { href: "/publications/publications_own", label: "Mis Publicaciones" },
  { href: "/chat", label: "Mis Chats" },
  { href: "/profile", label: "Perfil" },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* menos padding para pegar el logo a la izquierda */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Grid 3 columnas: [izq | centro | der] */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* Izquierda: Logo + nombre (pegado) */}
          <div className="flex items-center gap-2 justify-self-start">
            <img src="/JobMatch.png" alt="JobMatch Logo" className="h-12 w-16" />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Centro: Nav centrado */}
          <nav className="hidden md:flex justify-center items-center gap-8">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Derecha: placeholder para equilibrar (acciones futuras) */}
          <div className="justify-self-end md:w-24" />
        </div>

        {/* Mobile nav (centrado) */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-center flex-wrap gap-4">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-xs font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
