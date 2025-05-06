// src/components/Sidebar.js
import React from 'react';

function Sidebar({
  currentUser,
  onLogout,
  activeSection,
  onSectionChange,
  isVisible = true
}) {
  // Если боковая панель скрыта, возвращаем null
  if (!isVisible) {
    return null;
  }
  
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