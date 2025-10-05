// components/ProfileHistory.tsx
import { PublicationStatus, PublicationType } from "@/lib/types/publication";

// Vista para la UI: fechas como string (serializable)
export type PublicationView = {
  idPublicacion: number;
  idUsuario: number;
  titulo: string;
  descripcion: string;
  remuneracion: number;
  tipo: PublicationType;
  estado: PublicationStatus;
  fechaPublicacion: string; // ISO
  fechaCierre?: string;     // ISO
  idUbicacion: number;
  idCategoria: number;
};

export type TopicView = {
  title: string;
  author?: string;
  time: string;     // ISO
  replies: number;
  content?: string;
};

type ProfileHistoryProps = {
  forumHistory: TopicView[];
  publications: PublicationView[];
};

export default function ProfileHistory({
  forumHistory,
  publications,
}: ProfileHistoryProps) {
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
                    {new Date(t.time).toLocaleString()}
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
            {publications.map((pub) => (
              <article
                key={pub.idPublicacion}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--card-bg)]"
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-lg">{pub.titulo}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(pub.fechaPublicacion).toLocaleString()}
                  </span>
                </header>

                {pub.descripcion && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                    {pub.descripcion}
                  </p>
                )}

                <p className="text-sm text-gray-600 mt-3">
                  <span className="font-medium">Estado:</span> {pub.estado} ·{" "}
                  <span className="font-medium">Remuneración:</span>{" "}
                  {Number(pub.remuneracion).toLocaleString()} ·{" "}
                  <span className="font-medium">Tipo:</span> {pub.tipo}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Ubicación:</span> #{pub.idUbicacion} ·{" "}
                  <span className="font-medium">Categoría:</span> #{pub.idCategoria}
                  {pub.fechaCierre && (
                    <>
                      {" "}| <span className="font-medium">Cierre:</span>{" "}
                      {new Date(pub.fechaCierre).toLocaleDateString()}
                    </>
                  )}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No has creado publicaciones todavía.</p>
        )}
      </section>
    </div>
  );
}
