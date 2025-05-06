// src/components/ChatList.js
import React, { useState } from 'react';

function ChatList({ 
  chats, 
  selectedChat, 
  onSelectChat, 
  loading 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Фильтрация чатов по поисковому запросу
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="chat-list-window">
      <div className="chat-list-header">
        <h2>Доступные чаты</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск чата..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Загрузка чатов...</div>
      ) : filteredChats.length === 0 ? (
        <div className="no-chats">Чаты не найдены</div>
      ) : (
        <div className="chats-list">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat && selectedChat.id === chat.id ? 'active' : ''} ${chat.unread ? 'has-unread' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                {chat.phoneNumber && (
                  <div className="chat-phone">{chat.phoneNumber}</div>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <div className={`unread-badge ${chat.unread ? 'new-message' : ''}`}>
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;