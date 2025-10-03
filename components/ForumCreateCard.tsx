"use client";

import React, { useState } from "react";
import type { Topic } from "../lib/types/forum";

type Props = {
  onCreate: (topic: Topic) => void;
};

const ForumCreateCard = ({ onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      setError("Ambos campos son obligatorios");
      return;
    }

    onCreate({
      title: title.trim(),
      content: content.trim(),
      author: "Usuario Actual",
      time: "Recién Publicado",
      replies: 0,
      comments: [],
    });

    setTitle("");
    setContent("");
    setError("");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Crear nuevo tema rápido</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Título del tema"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded-md"
      />
      <textarea
        placeholder="Descripción del tema"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded-md"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Publicar
      </button>
    </div>
  );
};

export default ForumCreateCard;
