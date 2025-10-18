// components/layout-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import HeaderAuth from "./header-auth";
import Footer from "./footer";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/homepublic",
];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Verifica si estamos en una ruta de autenticación
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (isAuthRoute) {
    // Rutas de auth: HeaderAuth
    return (
      <>
        <HeaderAuth />
        {children}
        <Footer />
      </>
    );
  }

  // Rutas normales: Header + Footer
  return (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
</div>
  );
}
