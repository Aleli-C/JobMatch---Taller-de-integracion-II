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
        <a key="prev" href="#" className="page-link" onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage - 1); }}>
          « Anterior
        </a>
      );
    }
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <a key={i} href="#" className={`page-link ${i === currentPage ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}>
          {i}
        </a>
      );
    }
    if (currentPage < totalPages) {
      buttons.push(
        <a key="next" href="#" className="page-link" onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage + 1); }}>
          Siguiente »
        </a>
      );
    }
    return buttons;
  };

  return (
    <div className="container">
      <div className="forum-header">
        <h1>Foros de la comunidad</h1>
        <p>Encuentra o inicia un debate sobre temas de interés en el mundo freelance.</p>
        <button className="create-button" onClick={() => setIsCreateModalOpen(true)}>Crear nuevo tema</button>
      </div>
      
      <div className="forum-list">
        {topicsToRender.map((topic, index) => (
          <ForumCard
            key={topic.title + index}
            topic={topic}
            onClick={() => handleViewTopic(topic)}
          />
        ))}
      </div>

      <div className="pagination">
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