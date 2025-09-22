"use client";

import React, { useState } from "react";
import ForumCard from "./ForumCard";
import ViewTopicModal from "./ViewTopicModal";
import CreateTopicModal from "./CreateTopicModal";
import { forumTopics as initialTopics } from "../lib/utils/data";
import type { Topic } from "../lib/types/forum";
const itemsPerPage = 10;

const Forum = () => {
  const [forumTopics, setForumTopics] = useState<Topic[]>(initialTopics); // sin "as"
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const totalPages = Math.max(1, Math.ceil(forumTopics.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const topicsToRender = forumTopics.slice(start, end);

  const handleCreateTopic = (newTopic: Topic) => {
    setForumTopics([newTopic, ...forumTopics]);
    setIsCreateModalOpen(false);
    setCurrentPage(1);
  };

  const handleViewTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsViewModalOpen(true);
  };

  const handlePostReply = (replyText: string) => {
    if (!selectedTopic || replyText.trim() === "") return;

    const newComment = {
      author: "Yo",
      text: replyText,
      time: "Recién publicado",
    };

    const updatedTopics = forumTopics.map((topic) =>
      topic === selectedTopic
        ? {
            ...topic,
            replies: topic.replies + 1,
            comments: [...(topic.comments || []), newComment],
          }
        : topic
    );

    setForumTopics(updatedTopics);
    setSelectedTopic((prev) =>
      prev
        ? {
            ...prev,
            replies: prev.replies + 1,
            comments: [...(prev.comments || []), newComment],
          }
        : prev
    );
  };

  const gotoPage = (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage(i);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b pb-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800">Foros de la comunidad</h1>
          <p className="text-gray-600 mt-1">
            Encuentra o inicia un debate sobre temas de interés en el mundo freelance.
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          onClick={() => setIsCreateModalOpen(true)}
          type="button"
        >
          Crear nuevo tema
        </button>
      </div>

      <div className="space-y-4">
        {topicsToRender.map((topic, index) => (
          <ForumCard key={topic.title + index} topic={topic} onClick={() => handleViewTopic(topic)} />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-1">
        {currentPage > 1 && (
          <a href="#" className="text-blue-500 hover:text-blue-700 mx-1" onClick={gotoPage(currentPage - 1)}>
            « Anterior
          </a>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
          <a
            key={i}
            href="#"
            className={`mx-1 px-3 py-1 rounded ${
              i === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={gotoPage(i)}
          >
            {i}
          </a>
        ))}
        {currentPage < totalPages && (
          <a href="#" className="text-blue-500 hover:text-blue-700 mx-1" onClick={gotoPage(currentPage + 1)}>
            Siguiente »
          </a>
        )}
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
