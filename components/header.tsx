// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },                  // home (app/page.tsx)
  { href: "/publications/publications_view", label: "Publicaciones" },
  { href: "/publications/publications_own", label: "Mis Publicaciones" },
  { href: "/chat", label: "Mis Chats" },
  { href: "/profile", label: "Perfil" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Registro" },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo sin fondo.png" alt="JobMatch Logo" className="h-16 w-20" />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  isActive(href) ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar Publicaciones"
              className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-center flex-wrap gap-4">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={[
                  "text-xs font-medium transition-colors duration-200",
                  isActive(href) ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
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
