import React, { useState } from 'react';

const ViewTopicModal = ({ isOpen, onClose, topic, onPostReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    onPostReply(replyText);
    setReplyText('');
  };

  if (!isOpen || !topic) return null;

  return (
    <div id="viewTopicModal" className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 id="viewTopicTitle" className="modal-title">{topic.title}</h2>
        <div id="viewTopicMeta" className="modal-meta">
          <span>👤 Creado por: **{topic.author}**</span> | <span>🗓️ {topic.time}</span> | <span>💬 {topic.replies} respuestas</span>
        </div>
        <p id="viewTopicContent" className="modal-body">{topic.content}</p>
        
        <hr />
        
        <h3 className="comment-section-header">Comentarios</h3>
        <div id="commentSection" className="reply-section">
          {topic.comments && topic.comments.length > 0 ? (
            topic.comments.map((comment, index) => (
              <div key={index} className="reply-box">
                <p>{comment.text}</p>
                <div className="reply-meta">
                  <span>- {comment.author}</span>
                  <span className="text-gray-400"> • {comment.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aún no hay respuestas. ¡Sé el primero en comentar!</p>
          )}
        </div>
        
        <div className="reply-form">
          <textarea id="replyInput" placeholder="Escribe un comentario..." rows="2" value={replyText} onChange={(e) => setReplyText(e.target.value)}></textarea>
          <button id="postReplyBtn" onClick={handleReplySubmit}>Publicar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewTopicModal;