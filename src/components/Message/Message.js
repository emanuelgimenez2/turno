import React from 'react';
import './Message.css'; // Archivo CSS local

const Message = ({ title, message, onClose, type }) => {
  let messageTypeClass = '';

  switch (type) {
    case 'success':
      messageTypeClass = 'success-message';
      break;
    case 'error':
      messageTypeClass = 'error-message';
      break;
    case 'info':
      messageTypeClass = 'info-message';
      break;
    default:
      messageTypeClass = 'info-message';
      break;
  }

  return (
    <div className={`message-overlay ${messageTypeClass}`}>
      <div className="message">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Message;
