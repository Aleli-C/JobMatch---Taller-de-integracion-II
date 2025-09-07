'use client';

const ChatInfoPanel = ({ user, isVisible, onClose }) => {
  if (!user) return null;

  return (
    <aside
      className={`w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col items-center p-6 gap-4 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="w-full text-right">
        <button className="text-gray-500 text-2xl" onClick={onClose}>
          ✖
        </button>
      </div>
      <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-4xl mb-2">
        {user.avatar}
      </div>
      <h2 className="text-xl font-semibold">{user.name}</h2>
      
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-500 mb-1">Acerca de</h3>
        <p className="text-sm text-gray-700">{user.about}</p>
      </div>
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-500 mb-1">Contacto</h3>
        <p className="text-sm text-gray-700">{user.contact}</p>
      </div>
    </aside>
  );
};

export default ChatInfoPanel;