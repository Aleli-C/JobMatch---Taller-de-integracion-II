import React from 'react';

const ChatItem = ({ chat, isActive, onClick }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <li
      className={`flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center flex-shrink-0">
        {chat.user.avatar}
      </div>
      <div className="flex-grow flex flex-col min-w-0">
        <span className="font-semibold text-gray-900 truncate">
          {chat.user.name}
        </span>
        <span className="text-sm text-gray-500 truncate">
          {lastMessage ? lastMessage.text : 'No hay mensajes.'}
        </span>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {lastMessage ? lastMessage.time : ''}
      </span>
    </li>
  );
};

export default ChatItem;
