// src/app/publications/publications_mock/layout.tsx
import "../../globals.css";

export default function PublicationsMockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      {children}
    </main>
  );
}
