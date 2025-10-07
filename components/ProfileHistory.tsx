// components/ProfileHistory.tsx
import { PublicationStatus, PublicationType } from "@/lib/types/publication";

// Soporte para ambos shapes: simple por IDs o con relaciones anidadas
type PubBase = {
  id: number;
  usuarioId: number;
  titulo: string;
  descripcion?: string | null;
  remuneracion: number | string; // Prisma.Decimal -> string
  tipo: PublicationType;
  estado: PublicationStatus;
  createdAt: string | Date;
  closedAt?: string | Date | null;
  // por IDs
  ubicacionId?: number | null;
  categoriaId?: number | null;
  // por relaciones
  ubicacion?: { region?: string | null; comuna?: string | null } | null;
  categoria?: { nombre?: string | null } | null;
};

export type TopicView = {
  title: string;
  author?: string;
  time?: string;            // compat legacy
  createdAt?: string | Date; // preferido por schema
  replies: number;
  content?: string;
};

type ProfileHistoryProps = {
  forumHistory: TopicView[];
  publications: PubBase[];
};

// helpers
const asNumber = (v: number | string) => Number(v ?? 0);
const fmtMoneyCLP = (v: number | string) =>
  asNumber(v).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const asDate = (v?: string | Date | null) => (v ? new Date(v) : null);
const fmtDateTime = (v?: string | Date | null) => {
  const d = asDate(v);
  return d ? d.toLocaleString("es-CL") : "";
};
const fmtDate = (v?: string | Date | null) => {
  const d = asDate(v);
  return d ? d.toLocaleDateString("es-CL") : "";
};

const statusLabel = (s: PublicationStatus) => {
  switch (s) {
    case "ACTIVO": return "Abierta";
    case "CERRADO": return "Cerrado";
    case "INACTIVO": return "Inactivo";
    default: return String(s);
  }
};
const typeLabel = (t: PublicationType) => {
  switch (t) {
    case "FULLTIME": return "Tiempo completo";
    case "PARTTIME": return "Medio tiempo";
    case "FREELANCE": return "Independiente";
    default: return String(t);
  }
};

export default function ProfileHistory({ forumHistory, publications }: ProfileHistoryProps) {
  return (
    <div className="space-y-8">
      {/* Historial de foros */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mi Actividad en el Foro</h2>

        {forumHistory?.length ? (
          <div className="space-y-4">
            {forumHistory.map((t, idx) => (
              <article
                key={`${t.title}-${idx}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--card-bg)]"
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-lg">{t.title}</h3>
                  <span className="text-xs text-gray-500">
                    {fmtDateTime(t.createdAt ?? t.time)}
                  </span>
                </header>

                {t.content && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                    {t.content}
                  </p>
                )}

                <footer className="text-xs text-gray-500 mt-3">
                  {t.replies} respuesta{t.replies === 1 ? "" : "s"}
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tienes actividad en el foro.</p>
        )}
      </section>

      {/* Historial de publicaciones */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>

        {publications?.length ? (
          <div className="space-y-4">
            {publications.map((pub) => {
              const loc =
                pub.ubicacion?.comuna || pub.ubicacion?.region
                  ? [pub.ubicacion?.comuna, pub.ubicacion?.region].filter(Boolean).join(", ")
                  : (pub.ubicacionId ? `#${pub.ubicacionId}` : "—");

              const cat = pub.categoria?.nombre || (pub.categoriaId ? `#${pub.categoriaId}` : "—");

              return (
                <article
                  key={pub.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--card-bg)]"
                >
                  <header className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-medium text-lg">{pub.titulo}</h3>
                    <span className="text-xs text-gray-500">
                      {fmtDateTime(pub.createdAt)}
                    </span>
                  </header>

                  {pub.descripcion && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                      {pub.descripcion}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-medium">Estado:</span> {statusLabel(pub.estado)} ·{" "}
                    <span className="font-medium">Remuneración:</span> {fmtMoneyCLP(pub.remuneracion)} ·{" "}
                    <span className="font-medium">Tipo:</span> {typeLabel(pub.tipo)}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Ubicación:</span> {loc} ·{" "}
                    <span className="font-medium">Categoría:</span> {cat}
                    {pub.closedAt && (
                      <>
                        {" "}| <span className="font-medium">Cierre:</span> {fmtDate(pub.closedAt)}
                      </>
                    )}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No has creado publicaciones todavía.</p>
        )}
      </section>
    </div>
  );
}
