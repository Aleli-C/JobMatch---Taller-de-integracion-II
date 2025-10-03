// components/ProfileHistory.tsx
import { Topic } from "@/lib/types/forum";
import { Publication } from "@/lib/types/publication";

type ProfileHistoryProps = {
  forumHistory: Topic[];
  publications: Publication[];
};

export default function ProfileHistory({
  forumHistory,
  publications,
}: ProfileHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Historial de foros */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mis Preguntas en Foros</h2>
        {forumHistory.length > 0 ? (
          <div className="space-y-4">
            {forumHistory.map((topic, index) => (
              <div
                key={index} // usamos el índice porque Topic no tiene id
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--card-bg)]"
              >
                <h3 className="font-medium text-lg">{topic.title}</h3>
                <p className="text-sm text-gray-500">
                  {topic.author} • {topic.time}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {topic.content}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {topic.replies} respuestas
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No has participado en foros todavía.
          </p>
        )}
      </section>

      {/* Historial de publicaciones */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>
        {publications.length > 0 ? (
          <div className="space-y-4">
            {publications.map((pub) => (
              <div
                key={pub.idPublicacion}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--card-bg)]"
              >
                <h3 className="font-medium text-lg">{pub.titulo}</h3>
                <p className="text-sm text-gray-500">
                  Estado: {pub.estado} •{" "}
                  {new Date(pub.fechaPublicacion).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {pub.descripcion}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {pub.remuneracion} • {pub.tipo}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No has creado publicaciones todavía.
          </p>
        )}
      </section>
    </div>
  );
}
