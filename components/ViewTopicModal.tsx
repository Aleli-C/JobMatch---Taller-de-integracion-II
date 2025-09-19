import React, { useState } from 'react';

const ViewTopicModal = ({ isOpen, onClose, topic, onPostReply }) => {
  const [replyText, setReplyText] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    onPostReply(replyText);
    setReplyText('');
  };

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[90vh] overflow-hidden relative">
        <div className="p-6 border-b border-gray-200">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 pr-10">{topic.title}</h2>
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-semibold">Por: {topic.author}</span> · <span>{topic.time}</span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{topic.content}</p>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Respuestas ({topic.replies})</h3>
          <div className="space-y-4">
            {topic.comments?.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.time}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handlePost} className="flex gap-3">
            <input
              type="text"
              placeholder="Escribe tu respuesta..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
            >
              Responder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewTopicModal;
