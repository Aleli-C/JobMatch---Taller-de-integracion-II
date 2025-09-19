import React from 'react';

const ForumCard = ({ topic, onClick }) => {
  return (
    <div
      className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{topic.title}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
          {topic.replies} respuestas
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{topic.content}</p>
      <div className="flex items-center text-xs text-gray-400 mt-4">
        <span className="mr-4">Por: <span className="text-gray-500 font-medium">{topic.author}</span></span>
        <span>{topic.time}</span>
      </div>
    </div>
  );
};

export default ForumCard;
