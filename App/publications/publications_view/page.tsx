// app/publicaciones/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function clp(v: any) {
  // Prisma Decimal -> number/string seguro para UI
  const n = typeof v?.toNumber === 'function' ? v.toNumber() : Number(v) // Decimal → number
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)
}

export default async function Page() {
  const pubs = await prisma.publicacion.findMany({
    orderBy: { fechaPublicacion: 'desc' },
    include: {
      categoria: { select: { nombre: true, icono: true } },
      ubicacion: { select: { ciudad: true, region: true } },
      usuario:   { select: { id: true, nombre: true, tipoUsuario: true } },
    },
  })

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <nav className="flex gap-2">
          <Link href="/publicaciones/nueva" className="px-3 py-2 bg-blue-600 text-white rounded">Nueva</Link>
          <Link href="/chat"   className="px-3 py-2 border rounded">Chat</Link>
          <Link href="/perfil" className="px-3 py-2 border rounded">Perfil</Link>
        </nav>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pubs.map(p => (
          <Link key={p.id} href={`/publicaciones/${p.id}`} className="block">
            {/* Tu componente de card actual */}
            <div className="border rounded p-4 hover:shadow">
              <div className="text-2xl">{p.icono ?? (p.tipo === 'FREELANCE' ? '🧰' : '🧑‍💼')}</div>
              <h3 className="font-semibold mt-2">{p.titulo}</h3>
              <p className="text-gray-600 line-clamp-3">{p.descripcion}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>{p.ubicacion?.ciudad ?? '—'}{p.ubicacion?.region ? `, ${p.ubicacion.region}` : ''}</span> · <span>{clp(p.remuneracion)}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {p.categoria?.nombre} · {p.tipo} · {p.estado}
              </div>
            </div>
          </Link>
        ))}
        {!pubs.length && (
          <div className="text-gray-500">
            No hay publicaciones. <Link href="/publicaciones/nueva" className="text-blue-600 underline">Crea la primera</Link>.
          </div>
        )}
      </section>
    </main>
  )
}
