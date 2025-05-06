import React, { useState } from 'react';

function Sidebar({ 
  currentUser, 
  onLogout, 
  activeSection, 
  onSectionChange, 
  chats, 
  selectedChat, 
  onSelectChat 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Фильтрация чатов по поисковому запросу
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="avatar">{currentUser.avatar}</div>
          <div className="user-info">
            <div className="username">{currentUser.username}</div>
            <div className="user-role">{currentUser.role}</div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <div 
          className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSectionChange('dashboard')}
        >
          <i className="icon dashboard-icon">📊</i>
          <span>Дашборд</span>
        </div>
        
        <div 
          className={`menu-item ${activeSection === 'chats' ? 'active' : ''}`}
          onClick={() => onSectionChange('chats')}
        >
          <i className="icon chats-icon">💬</i>
          <span>Чаты</span>
        </div>
        
        <div 
          className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => onSectionChange('users')}
        >
          <i className="icon users-icon">👥</i>
          <span>Пользователи</span>
        </div>
        
        <div 
          className={`menu-item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => onSectionChange('settings')}
        >
          <i className="icon settings-icon">⚙️</i>
          <span>Настройки</span>
        </div>
      </div>
      
      {activeSection === 'chats' && (
        <div className="chats-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск чата..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="chats-list">
            {filteredChats.length === 0 ? (
              <div className="no-chats">Чаты не найдены</div>
            ) : (
              filteredChats.map(chat => (
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
              ))
            )}
          </div>
        </div>
      )}
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <i className="logout-icon">🚪</i>
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;