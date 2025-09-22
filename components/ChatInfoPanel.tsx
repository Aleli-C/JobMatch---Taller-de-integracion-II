import React from 'react';

type ChatUser = {
  name: string;
  about: string;
  contact: string;
  avatar: string;
};

type Props = {
  user?: ChatUser | null;
  isVisible: boolean;
  onClose: () => void;
};

const ChatInfoPanel = ({ user, isVisible, onClose }: Props) => {
  if (!user) return null;

  return (
    <aside
      className={`w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col items-center p-6 gap-4 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="w-full flex justify-end">
        <button className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-4xl mb-2 flex-shrink-0">
        {user.avatar}
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
      
      <div className="w-full flex flex-col items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-sm font-semibold text-indigo-600 mb-1">Acerca de</h3>
          <p className="text-sm text-gray-700">{user.about}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-indigo-600 mb-1">Contacto</h3>
          <p className="text-sm text-gray-700">{user.contact}</p>
        </div>
      </div>
    </aside>
  );
};

export default ChatInfoPanel;
