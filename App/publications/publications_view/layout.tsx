// app/publications/publications-view/layout.tsx
"use client";
import "../../globals.css";
import { ToastProvider } from "../../../components/ToastContext";

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <main className="min-h-screen">{children}</main>
    </ToastProvider>
  );
}
