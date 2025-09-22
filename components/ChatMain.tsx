'use client';


import { useState } from "react";

type Message = { text: string; senderId: string; time: string };
type ChatUser = { name: string; about: string; contact: string; avatar: string };
type Chat = { id: string; user: ChatUser; messages: Message[] };

type Props = {
  activeChat?: Chat | null;
  onSendMessage: (text: string) => void;
  onToggleInfoPanel: () => void;
};

const ChatMain = ({ activeChat, onSendMessage, onToggleInfoPanel }: Props) => {
  const [messageText, setMessageText] = useState<string>("");

  const handleSend = () => {
    onSendMessage(messageText);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <main className="flex-grow flex flex-col bg-gray-100">
      <div
        className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 cursor-pointer"
        onClick={onToggleInfoPanel}
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xl">
          {activeChat?.user.avatar}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 m-0">
          {activeChat?.user.name || 'Selecciona un chat'}
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-white flex flex-col gap-4">
        {activeChat?.messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[70%] text-sm ${
              message.senderId === 'me'
                ? 'bg-blue-50 text-gray-900 self-end ml-auto'
                : 'bg-gray-100 text-gray-900 self-start mr-auto'
            }`}
          >
            {message.text}
            <span className="block text-xs text-gray-400 mt-1 text-right">
              {message.time}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-200 shadow-sm flex-shrink-0">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-grow p-3 border border-gray-300 rounded-full text-base outline-none"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeChat}
        />
        <button
          className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg cursor-pointer transition hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleSend}
          disabled={!activeChat || messageText.trim() === ''}
        >
          ➤
        </button>
      </div>
    </main>
  );
};

export default ChatMain;