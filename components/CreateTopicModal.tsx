import React, { useState } from 'react';
import type { Topic } from "../lib/types/forum";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (topic: Topic) => void; // <- unificado
};

const CreateTopicModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onCreate({
        title,
        content,
        author: "Usuario Actual",
        time: "Recién Publicado",
        replies: 0,
        comments: [],
      });
      setTitle("");
      setContent("");
    }
  };

  if (!isOpen) return null;

  return (
    <div id="createTopicModal" className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Crear nuevo tema</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <input type="text" id="topicTitle" placeholder="Título del tema" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <textarea id="topicContent" placeholder="Descripción del tema" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
          </div>
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="publish-btn">Publicar tema</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;