// app/chat/[conversationId]/page.tsx
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";                 // ← usa getSession
import {
  getChatsByUserId,
  getMessagesByChatId,
  saveMessage,
} from "@/lib/repositories/chatPersistence";
import ChatSidebar from "@/components/ChatSideBar";
import ChatMain from "@/components/ChatMain";
import ChatInfoPanel from "@/components/ChatInfoPanel";

// ===== Tipos que esperan tus componentes de UI =====
type UIMessage = { text: string; senderId: string; time: string };
type UIChatUser = { name: string; about: string; contact: string; avatar: string };
type UIChat = { id: string; user: UIChatUser; messages: UIMessage[] };

type PageProps = { params: { conversationId: string } };

// ===== Server Component =====
export default async function ChatPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const userId = Number(session.sub);                        // ← id desde sub
  if (!Number.isInteger(userId)) redirect("/auth/login");

  const chatId = Number(params.conversationId);
  if (!Number.isFinite(chatId)) redirect("/chat");

  // 1) Traemos todos los chats del usuario (para el sidebar)
  const chatsDb = await getChatsByUserId(userId);

  // 2) Buscamos el chat activo
  const activeDb = chatsDb.find((c: any) => c.id === chatId);
  if (!activeDb) redirect("/chat"); // seguridad

  // 3) Determinamos el otro usuario
  const otherDb = activeDb.usuario1Id === userId ? activeDb.usuario2 : activeDb.usuario1;
  const destinatarioId: number = otherDb.id;

  // 4) Traemos todos los mensajes de este chat
  const messagesDb = await getMessagesByChatId(chatId);

  // 5) Adaptamos datos para Sidebar
  const sidebarChats: UIChat[] = chatsDb.map((c: any) => {
    const other = c.usuario1Id === userId ? c.usuario2 : c.usuario1;
    const last = c.mensajes?.[0];
    return {
      id: String(c.id),
      user: {
        name: other?.nombre ?? "Usuario",
        about: other?.perfil?.experiencia ?? "",
        contact: other?.correo ?? "",
        avatar: other?.perfil?.foto ?? "/avatar-placeholder.png",
      },
      messages: last
        ? [
            {
              text: last.contenido,
              senderId: String(last.remitenteId),
              time: new Date(last.enviadoEn).toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]
        : [],
    };
  });

  // 6) Adaptamos el chat activo
  const activeChat: UIChat = {
    id: String(activeDb.id),
    user: {
      name: otherDb?.nombre ?? "Usuario",
      about: otherDb?.perfil?.experiencia ?? "",
      contact: otherDb?.correo ?? "",
      avatar: otherDb?.perfil?.foto ?? "/avatar-placeholder.png",
    },
    messages: messagesDb.map((m: any) => ({
      text: m.contenido,
      senderId: String(m.remitenteId),
      time: new Date(m.enviadoEn).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
  };

  // 7) Server Action para enviar mensaje
  async function sendMessageAction(formData: FormData) {
    "use server";
    const text = String(formData.get("text") ?? "");
    if (!text.trim()) return;

    await saveMessage({
      chatId,
      remitenteId: userId,                                  // ← usa userId
      destinatarioId,
      contenido: text,
    });

    revalidatePath(`/chat/${chatId}`);
  }

  return (
    <ChatView
      allChats={sidebarChats}
      activeChat={activeChat}
      sendMessageAction={sendMessageAction}
    />
  );
}

// ===== Client Wrapper (maneja onSendMessage / UI interactiva) =====
function ChatView({
  allChats,
  activeChat,
  sendMessageAction,
}: {
  allChats: UIChat[];
  activeChat: UIChat;
  sendMessageAction: (formData: FormData) => Promise<void>;
}) {
  "use client";

  const { useRouter } = require("next/navigation");
  const { useRef, useState } = require("react") as typeof import("react");
  const router = useRouter();

  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenTextRef = useRef<HTMLInputElement>(null);

  const onSendMessageClient = (text: string) => {
    if (!formRef.current || !hiddenTextRef.current) return;
    hiddenTextRef.current.value = text;
    formRef.current.requestSubmit();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <ChatSidebar
        chats={allChats}
        activeChatId={activeChat?.id ?? null}
        onSelectChat={(id) => router.push(`/chat/${id}`)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <form ref={formRef} action={sendMessageAction} className="flex-1 flex flex-col">
          <input ref={hiddenTextRef} type="hidden" name="text" />
          <ChatMain
            activeChat={activeChat}
            onSendMessage={onSendMessageClient}
            onToggleInfoPanel={() => setIsInfoPanelVisible((v: boolean) => !v)}
          />
        </form>
      </div>

      <ChatInfoPanel
        user={activeChat?.user}
        isVisible={isInfoPanelVisible}
        onClose={() => setIsInfoPanelVisible(false)}
      />
    </div>
  );
}
