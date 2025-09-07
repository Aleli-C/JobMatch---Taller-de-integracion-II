'use client';

import React from 'react';

const ChatItem = ({ chat, isActive, onClick }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <li
      className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition hover:bg-gray-50 ${
        isActive ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
        {chat.user.avatar}
      </div>
      <div className="flex-grow flex flex-col min-w-0">
        <span className="font-semibold text-gray-900 truncate">{chat.user.name}</span>
        <span className="text-sm text-gray-500 truncate">
          {lastMessage ? lastMessage.text : 'No hay mensajes'}
        </span>
      </div>
      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
        {lastMessage ? lastMessage.time : ''}
      </span>
    </li>
  );
};

export default ChatItem;