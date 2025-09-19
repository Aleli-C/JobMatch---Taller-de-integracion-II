'use client';

import { useState } from 'react';
import ChatItem from './ChatItem';

const ChatSidebar = ({ chats, activeChatId, onSelectChat }) => {
  const [filter, setFilter] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Buscar en chats..."
          className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="flex-grow overflow-y-auto list-none p-0 m-0">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;