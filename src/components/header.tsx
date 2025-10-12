// components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/publications/publications_view", label: "Publicaciones" },
  { href: "/publications/publications_own", label: "Mis Publicaciones" },
  { href: "/chat", label: "Mis Chats" },
  { href: "/forum", label: "Foro" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const logout = async () => {
    try {
      setSigningOut(true);
      if (typeof window !== "undefined") localStorage.removeItem("uid");
      await api.post("/auth/logout").catch(() => {});
    } finally {
      setSigningOut(false);
      router.push("/auth/homepublic");
      router.refresh();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* Izquierda: Logo + nombre */}
          <div className="flex items-center gap-2 justify-self-start">
            <img src="/JobMatch.png" alt="JobMatch Logo" className="h-12 w-16" />
            <span className="text-2xl font-bold text-blue-600">JobMatch</span>
          </div>

          {/* Centro: Nav */}
          <nav className="hidden md:flex justify-center items-center gap-8">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  isActive(href) ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Derecha: Avatar + Logout */}
          <div className="justify-self-end flex items-center gap-3">
            <button
              onClick={logout}
              disabled={signingOut}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              title="Cerrar sesión"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                <path fill="currentColor" d="M10 17v-2h4v-6h-4V7h6v10zM13 21H5V3h8v2H7v14h6z"/>
              </svg>
              Salir
            </button>

            <Link
              href="/profile"
              aria-label="Ir a mi perfil"
              title="Mi perfil"
              className="group relative inline-block h-10 w-10 rounded-full p-[2px]
                         bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-500
                         transition-transform duration-200 hover:scale-105
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full blur-[6px]
                           opacity-40 group-hover:opacity-70
                           bg-gradient-to-tr from-blue-600/40 via-cyan-400/40 to-purple-500/40"
                aria-hidden="true"
              />
              <span className="relative block h-full w-full rounded-full overflow-hidden bg-white ring-1 ring-black/5">
                <Image src="/avatar.png" alt="Foto de perfil" fill sizes="40px" className="object-cover" priority />
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Mobile nav + logout */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-center flex-wrap gap-4 mb-2">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "text-xs font-medium transition-colors duration-200",
                  isActive(href) ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex justify-center">
            <button
              onClick={logout}
              disabled={signingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80">
                <path fill="currentColor" d="M10 17v-2h4v-6h-4V7h6v10zM13 21H5V3h8v2H7v14h6z"/>
              </svg>
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
