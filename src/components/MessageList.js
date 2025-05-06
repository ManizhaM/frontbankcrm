// src/components/MessageList.js
import React from 'react';

function MessageList({ messages, currentUser }) {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">Нет сообщений</div>
      ) : (
        messages.map((message, index) => {
          const isCurrentUser = message.type === currentUser;
          
          return (
            <div 
              key={index} 
              className={`message ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">{message.type || 'Неизвестный'}</span>
                  <span className="message-time">{message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MessageList;