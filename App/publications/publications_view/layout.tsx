// app/publications/publications-view/layout.tsx
"use client";
import "../../globals.css"
import Header from "../../../components/header"
import Footer from "../../../components/footer"
import { ToastProvider } from "../../../components/ToastContext";

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </ToastProvider>
  )
}
