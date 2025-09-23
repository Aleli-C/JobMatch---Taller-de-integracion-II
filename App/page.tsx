// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[100svh] bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(0,0,0,0.06),transparent)]">
      {/* HERO */}
      <section className="relative">
        {/* glow decorativo */}
        <div className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-40 max-w-5xl rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20 blur-2xl" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-36">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/10">
                Beta pública
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent">
                  Encuentra y publica trabajos eventuales
                </span>
              </h1>
              <p className="mt-4 max-w-prose text-zinc-600">
                Conecta oferentes y trabajadores en tu comuna. Publica, postula y chatea en tiempo real.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Iniciar sesión
                </Link>
              </div>
              <p className="mt-3 text-sm text-zinc-500">
                ¿Nuevo aquí? Revisa{" "}
                <Link href="/ayuda" className="underline underline-offset-4">
                  la ayuda
                </Link>
                .
              </p>
            </div>

            {/* Ilustración / mock */}
            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-xl backdrop-blur-sm">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 ring-1 ring-inset ring-zinc-200" />
            </div>
          </div>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900">Explora</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card href="/publications_view"        title="Ver publicaciones"  desc="Ofertas recientes con filtros." />
          <Card href="/publications_own/"   title="Crear publicación"  desc="Publica un trabajo en minutos." />
          <Card href="/chat/chats"               title="Mis chats"          desc="Coordina detalles en tiempo real." />
          <Card href="/forum"                    title="Foro"               desc="Resuelve dudas y comparte consejos." />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl">
          <h3 className="text-xl font-semibold text-zinc-900">¿Listo para empezar?</h3>
          <p className="mt-2 text-zinc-600">Crea tu perfil y encuentra tu próximo trabajo hoy.</p>
          <div className="mt-5">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Ir a mi perfil
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md hover:ring-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 transition group-hover:bg-zinc-50">
          Abrir
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
    </Link>
  );
}
