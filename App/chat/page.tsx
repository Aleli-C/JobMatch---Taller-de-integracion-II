'use client';

import { useState } from 'react';
import ChatSidebar from '../../components/ChatSideBar';
import ChatMain from '../../components/ChatMain';
import ChatInfoPanel from '../../components/ChatInfoPanel';
import Header from '../../components/header'; // Importamos el componente Header

type Message = { text: string; senderId: string; time: string };
type ChatUser = { name: string; about: string; contact: string; avatar: string };
type Chat = { id: string; user: ChatUser; messages: Message[] };

const initialChats = [
  {
    id: 'chat_1',
    user: {
      name: 'Juan Gutierrez',
      about: 'Diseñador gráfico, experto en UI/UX. Con 10 años de experiencia.',
      contact: 'juan.g@gmail.com | +56 9 1111 2222',
      avatar: 'JG',
    },
    messages: [
      { text: 'Hola Juan, ¿cómo estás?', senderId: 'me', time: '14:28' },
      { text: '¡Hola! Todo bien, ¿y tú?', senderId: 'chat_1', time: '14:29' },
      { text: 'Aquí andamos. Quería preguntarte si tienes disponibilidad para un proyecto de diseño la próxima semana.', senderId: 'me', time: '14:30' },
      { text: 'Sí, tengo algo de espacio. Cuéntame más detalles cuando puedas.', senderId: 'chat_1', time: '14:31' },
    ],
  },
  {
    id: 'chat_2',
    user: {
      name: 'Sofía R.',
      about: 'Desarrolladora web full-stack, especialista en React y Node.js.',
      contact: 'sofia.r@outlook.com | +56 9 3333 4444',
      avatar: 'SR',
    },
    messages: [
      { text: 'Hola Sofía, ¿qué tal?', senderId: 'me', time: '10:00' },
      { text: '¡Hola! Todo bien, gracias.', senderId: 'chat_2', time: '10:01' },
      { text: 'El logo quedó genial, muchas gracias.', senderId: 'me', time: '10:05' },
    ],
  },
  {
    id: 'chat_3',
    user: {
      name: 'Carlos Díaz',
      about: 'Consultor de marketing digital y SEO. Ayudo a crecer negocios en línea.',
      contact: 'carlos.d@gmail.com | +56 9 5555 6666',
      avatar: 'CD',
    },
    messages: [
      { text: 'Hola Carlos. Te envío el archivo con los requisitos.', senderId: 'me', time: 'Ayer' },
      { text: 'Recibido. Lo reviso y te comento.', senderId: 'chat_3', time: 'Ayer' },
    ],
  },
];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState<boolean>(false);

  const activeChat: Chat | null = chats.find((c) => c.id === activeChatId) ?? null;

  const handleSendMessage = (text: string): void => {
    if (!activeChat) return;
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const newMessage: Message = { text, senderId: "me", time };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
      )
    );
  };

  const handleSelectChat = (id: string): void => {
    setActiveChatId(id);
    setIsInfoPanelVisible(false);
  };

  const handleToggleInfoPanel = (): void => {
    setIsInfoPanelVisible((v) => !v);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex w-full flex-grow bg-gray-100">
        <ChatSidebar chats={chats} activeChatId={activeChatId} onSelectChat={handleSelectChat} />
        <ChatMain activeChat={activeChat} onSendMessage={handleSendMessage} onToggleInfoPanel={handleToggleInfoPanel} />
        <ChatInfoPanel user={activeChat?.user} isVisible={isInfoPanelVisible} onClose={handleToggleInfoPanel} />
      </div>
    </div>
  );
}