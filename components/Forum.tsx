'use client';

import React, { useState } from 'react';
import ForumCard from './ForumCard';
import CreateTopicModal from './CreateTopicModal';
import ViewTopicModal from './ViewTopicModal';
import { forumTopics as initialTopics, generateRandomComments } from '../utils/data';

const itemsPerPage = 10;

const Forum = () => {
  const [forumTopics, setForumTopics] = useState(initialTopics);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const totalPages = Math.ceil(forumTopics.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const topicsToRender = forumTopics.slice(start, end);

  const handleCreateTopic = (newTopic) => {
    setForumTopics([newTopic, ...forumTopics]);
    setIsCreateModalOpen(false);
    setCurrentPage(1);
  };

  const handleViewTopic = (topic) => {
    setSelectedTopic(topic);
    setIsViewModalOpen(true);
  };

  const handlePostReply = (replyText) => {
    if (replyText.trim() === '') return;

    const newComment = {
      author: 'Yo',
      text: replyText,
      time: 'Recién publicado',
    };

    const updatedTopics = forumTopics.map((topic) => {
      if (topic === selectedTopic) {
        return {
          ...topic,
          replies: topic.replies + 1,
          comments: [...(topic.comments || []), newComment],
        };
      }
      return topic;
    });

    setForumTopics(updatedTopics);
    setSelectedTopic((prevTopic) => ({
      ...prevTopic,
      replies: prevTopic.replies + 1,
      comments: [...(prevTopic.comments || []), newComment],
    }));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    if (currentPage > 1) {
      buttons.push(
        <a key="prev" href="#" className="text-blue-500 hover:text-blue-700 mx-1" onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage - 1); }}>
          « Anterior
        </a>
      );
    }
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <a key={i} href="#" className={`mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}>
          {i}
        </a>
      );
    }
    if (currentPage < totalPages) {
      buttons.push(
        <a key="next" href="#" className="text-blue-500 hover:text-blue-700 mx-1" onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage + 1); }}>
          Siguiente »
        </a>
      );
    }
    return buttons;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b pb-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800">Foros de la comunidad</h1>
          <p className="text-gray-600 mt-1">Encuentra o inicia un debate sobre temas de interés en el mundo freelance.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200" onClick={() => setIsCreateModalOpen(true)}>Crear nuevo tema</button>
      </div>
      
      <div className="space-y-4">
        {topicsToRender.map((topic, index) => (
          <ForumCard
            key={topic.title + index}
            topic={topic}
            onClick={() => handleViewTopic(topic)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {renderPaginationButtons()}
      </div>

      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTopic}
      />

      <ViewTopicModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        topic={selectedTopic}
        onPostReply={handlePostReply}
      />
    </div>
  );
};

export default Forum;
