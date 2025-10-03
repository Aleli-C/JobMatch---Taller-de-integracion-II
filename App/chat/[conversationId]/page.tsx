// app/chat/[conversationId]/page.tsx
<<<<<<< HEAD

=======
"use client";
>>>>>>> main
// ====================================================================
// IMPORTS Y LÓGICA DEL SERVIDOR (No se toca)
// ====================================================================
import { getSessionUser } from "@/lib/getSessionUser";
import { redirect } from "next/navigation";
import { getChatsByUserId, saveMessage } from "@/lib/repositories/chatPersistence";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Componentes Visuales que vamos a usar
<<<<<<< HEAD
import ChatSidebar from "@/components/ChatSidebar";
=======
import ChatSidebar from "@/components/ChatSideBar";
>>>>>>> main
import ChatMain from "@/components/ChatMain";
import ChatInfoPanel from "@/components/ChatInfoPanel";
import { useState } from "react";

// La Server Action para enviar mensajes se mantiene intacta
async function handleSendMessage(formData: FormData) {
  "use server";

  const contenido = formData.get("contenido")?.toString();
  const chatId = Number(formData.get("chatId"));
  const remitenteId = Number(formData.get("remitenteId"));
  const destinatarioId = Number(formData.get("destinatarioId"));

  if (!contenido?.trim()) return;

  await saveMessage({ chatId, remitenteId, destinatarioId, contenido });

  revalidatePath(`/chat/${chatId}`);
}


// ====================================================================
// COMPONENTE DE CLIENTE PARA MANEJAR LA UI INTERACTIVA
// ====================================================================

function ChatView({ session, allChats, activeChat, destinatarioId }: { session: any, allChats: any[], activeChat: any, destinatarioId: number }) {
  'use client'; // Marcamos este componente como de cliente

  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(false);

  // Adaptamos los datos para que los componentes visuales los entiendan
  const otherUser = activeChat.usuario1.id === session.id ? activeChat.usuario2 : activeChat.usuario1;

  const adaptedActiveChat = {
    id: activeChat.id.toString(),
    user: {
      name: otherUser.nombre,
      about: otherUser.sobreMi || 'Sin información de perfil.',
      contact: otherUser.email || 'Contacto no disponible.',
      avatar: otherUser.nombre.substring(0, 2).toUpperCase(),
    },
    messages: activeChat.mensajes.map((m: any) => ({
      text: m.contenido,
      senderId: m.remitenteId === session.id ? 'me' : otherUser.id.toString(),
      time: new Date(m.enviadoEn).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    }))
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <ChatSidebar chats={allChats} session={session} activeChatId={activeChat.id} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Envolvemos el ChatMain en el formulario para que la Server Action funcione */}
        <form action={handleSendMessage} className="flex-1 flex flex-col overflow-hidden">
          {/* Inputs ocultos necesarios para la Server Action */}
          <input type="hidden" name="chatId" value={activeChat.id} />
          <input type="hidden" name="remitenteId" value={session.id} />
          <input type="hidden" name="destinatarioId" value={destinatarioId} />

          {/* ChatMain ahora vive dentro del form y se encarga de la UI */}
          <ChatMain
            activeChat={adaptedActiveChat}
            onToggleInfoPanel={() => setIsInfoPanelVisible(!isInfoPanelVisible)}
            // Ya no necesita onSendMessage, el form se encarga de eso
          />
        </form>
      </div>
      
      <ChatInfoPanel 
        user={adaptedActiveChat.user}
        isVisible={isInfoPanelVisible}
        onClose={() => setIsInfoPanelVisible(false)}
      />
    </div>
  );
}


// ====================================================================
// COMPONENTE DE SERVIDOR (Punto de entrada)
// ====================================================================

export default async function ChatPage({ params }: { params: { conversationId: string } }) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");

  const chatId = Number(params.conversationId);

  // 1. Obtenemos TODOS los chats del usuario para la barra lateral
  const allChats = await getChatsByUserId(session.id);

  // 2. Obtenemos el chat ACTIVO con todos sus detalles
  const activeChat = await prisma.chat.findUnique({
    where: { id: chatId, OR: [{ usuario1Id: session.id }, { usuario2Id: session.id }] },
    include: {
      usuario1: true,
      usuario2: true,
      mensajes: { orderBy: { enviadoEn: "asc" } },
    },
  });

  // Si el chat no existe o el usuario no pertenece a él, lo mandamos a la página principal de chats
  if (!activeChat) {
    return redirect("/chat");
  }

  // 3. Calculamos el destinatario (lógica que ya tenías)
  const destinatarioId = activeChat.usuario1.id === session.id 
    ? activeChat.usuario2.id 
    : activeChat.usuario1.id;

  // 4. Renderizamos el componente de cliente pasándole todos los datos necesarios
  return (
    <ChatView 
      session={session}
      allChats={allChats}
      activeChat={activeChat}
      destinatarioId={destinatarioId}
    />
  );
}