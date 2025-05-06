// src/components/ChatList.js
import React from 'react';

function ChatList({ chats, selectedChat, onSelectChat, loading }) {
  if (loading) {
    return (
      <div className="chat-list">
        <div className="loading">Загрузка чатов...</div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <h2>Доступные чаты</h2>
      {chats.length === 0 ? (
        <div className="no-chats">Нет доступных чатов</div>
      ) : (
        <ul>
          {chats.map(chat => (
            <li 
              key={chat.id} 
              className={selectedChat && selectedChat.id === chat.id ? 'selected' : ''}
              onClick={() => onSelectChat(chat)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatList;
