// src/app/publications/publications_own/page.tsx
import PublicationCard from "@/components/PublicationCard";

type SP = Record<string, string | string[] | null>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const normalized = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, v ?? null])
  ) as SP;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      {/* Sección principal */}
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Mis publicaciones
        </h1>

        {/* Contenedor de las publicaciones */}
        <div className="space-y-4">
          <PublicationCard searchParams={normalized} scope="mine" />
        </div>
      </section>
    </main>
  );
}
