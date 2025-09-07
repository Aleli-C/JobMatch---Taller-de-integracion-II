import React from 'react';

const ForumCard = ({ topic, onClick }) => {
  return (
    <article className="forum-card" onClick={onClick}>
      <h2 className="forum-title">{topic.title}</h2>
      <p>{topic.content}</p>
      <div className="forum-meta">
        <span>👤 Creado por: **{topic.author}**</span>
        <span>🗓️ {topic.time}</span>
        <span>💬 {topic.replies} respuestas</span>
      </div>
    </article>
  );
};

export default ForumCard;