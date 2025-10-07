// components/ProfileSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type Item = {
  path: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean; // para el dashboard
};

const items: Item[] = [
  {
    path: '/profile',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/profile/personal',
    label: 'Información',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    path: '/profile/pendientes',
    label: 'Pendientes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M7 21h10" />
      </svg>
    ),
  },
  {
    path: '/profile/favoritos',
    label: 'Favoritos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
    ),
  },
  {
    path: '/profile/historial',
    label: 'Historial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const isActive = useMemo(
    () => (it: Item) => (it.exact ? pathname === it.path : pathname.startsWith(it.path)),
    [pathname]
  );

  return (
    <nav aria-label="Perfil navigation" className="hidden lg:block">
      <div className="group fixed left-6 top-56 z-30">
        <div className="bg-gray-100 rounded-xl p-1 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-16 group-hover:w-72 transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-stretch">
              {items.map((it) => (
                <Link
                  key={it.path}
                  href={it.path}
                  className={`flex items-center gap-3 px-3 py-4 w-full hover:bg-gray-50 transition-colors ${
                    isActive(it) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  aria-current={isActive(it) ? 'page' : undefined}
                >
                  <div className="flex items-center justify-center w-10 h-10 text-blue-600">
                    {it.icon}
                  </div>
                  <span className="truncate text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {it.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
