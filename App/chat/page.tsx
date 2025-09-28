// app/chat/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/getSessionUser";
import Link from "next/link";

export default async function MisChatsPage() {
  // 1. Obtenemos la sesión del usuario a partir de la cookie
  const session = await getSessionUser();

  // 2. Validación extra: si no hay sesión, redirigimos
  if (!session) {
    redirect("/auth/login");
  }

  // 3. Consultamos los chats del usuario actual
  const chats = await prisma.chat.findMany({
    where: {
      // CORRECCIÓN: Los campos en el esquema son `usuario1_id` y `usuario2_id`,
      // que Prisma convierte a `usuario1Id` y `usuario2Id`.
      OR: [{ usuario1Id: session.id }, { usuario2Id: session.id }],
    },
    include: {
      usuario1: {
        // CORRECCIÓN: El campo ID en la tabla `usuarios` es `id`.
        select: { id: true, nombre: true },
      },
      usuario2: {
        // CORRECCIÓN: El campo ID en la tabla `usuarios` es `id`.
        select: { id: true, nombre: true },
      },
      mensajes: {
        orderBy: { enviadoEn: "desc" },
        take: 1, // último mensaje
      },
    },
  });

  // 4. Renderizamos la vista
  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">
          Mis Chats
        </h1>

        {chats.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              Aún no tienes conversaciones. ¡Inicia una!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {chats.map((chat) => {
              // CORRECCIÓN: Usamos 'id' para la comparación, que viene de la tabla `usuarios`.
              const otherUser =
                chat.usuario1.id === session.id
                  ? chat.usuario2
                  : chat.usuario1;

              const lastMessage = chat.mensajes[0];

              return (
                // CORRECCIÓN: El ID del chat en la tabla `chats` es `id`.
                <li key={chat.id}>
                  <Link href={`/chat/${chat.id}`} legacyBehavior>
                    <a className="block p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {otherUser.nombre}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-400">
                            {new Date(
                              lastMessage.enviadoEn
                            ).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {lastMessage?.contenido || "Aún no hay mensajes."}
                      </p>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
