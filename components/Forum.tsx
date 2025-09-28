"use client";

import React, { useState } from "react";
import ForumCard from "./ForumCard";
import ViewTopicModal from "./ViewTopicModal";
import CreateTopicModal from "./CreateTopicModal";
import ForumFilterBar from "./ForumFilterBar";
import { forumTopics as initialTopics } from "../lib/utils/data";
import ForumCreateCard from "./ForumCreateCard";
import type { Topic } from "../lib/types/forum";

const itemsPerPage = 10;

const Forum = () => {
  const [forumTopics, setForumTopics] = useState<Topic[]>(initialTopics);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // filtros
  const [filters, setFilters] = useState<{ search: string; author: string; replies: string }>({
    search: "",
    author: "",
    replies: "",
  });

  // Opciones para el FilterBar (dinámicas)
  const authorOptions = [
    { value: "", label: "Todos" },
    ...Array.from(new Set(forumTopics.map((t) => t.author))).map((a) => ({ value: a, label: a })),
  ];

  const replyOptions = [
    { value: "", label: "Todas" },
    { value: "0", label: "Sin respuestas" },
    { value: "1-5", label: "1 a 5 respuestas" },
    { value: "6+", label: "Más de 5 respuestas" },
  ];

  // --- Lógica de filtros (se aplica antes de la paginación) ---
  const filteredTopics = forumTopics.filter((topic) => {
    const q = filters.search?.trim().toLowerCase() ?? "";
    const matchesSearch =
      !q ||
      topic.title.toLowerCase().includes(q) ||
      (topic.content && topic.content.toLowerCase().includes(q));

    const matchesAuthor = !filters.author || topic.author === filters.author;

    const matchesReplies =
      !filters.replies ||
      (filters.replies === "0" && topic.replies === 0) ||
      (filters.replies === "1-5" && topic.replies >= 1 && topic.replies <= 5) ||
      (filters.replies === "6+" && topic.replies > 5);

    return matchesSearch && matchesAuthor && matchesReplies;
  });

  // paginación basada en filteredTopics
  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const topicsToRender = filteredTopics.slice(start, end);

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
      <ForumCreateCard onCreate={handleCreateTopic} />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Buscar preguntas o respuestas
      </h3>
      {/* --- Aquí va la barra de filtros --- */}
      <ForumFilterBar
        authors={authorOptions}
        replies={replyOptions}
        defaults={{ search: filters.search, author: filters.author, replies: filters.replies }}
        onFilter={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
      />
      
      <div className="space-y-4">
        {topicsToRender.map((topic, index) => (
          <ForumCard key={topic.title + "-" + start + "-" + index} topic={topic} onClick={() => handleViewTopic(topic)} />
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
            className={`mx-1 px-3 py-1 rounded ${i === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

      <CreateTopicModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateTopic} />

      <ViewTopicModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} topic={selectedTopic} onPostReply={handlePostReply} />
    </div>
  );
};

export default Forum;
