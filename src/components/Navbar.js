// Компонент верхней панели (Navbar.js)
import React from 'react';

function Navbar({ 
  currentUser, 
  sidebarVisible, 
  setSidebarVisible, 
  selectedChat
}) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button 
          className="hamburger-menu"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          title={sidebarVisible ? "Скрыть меню" : "Показать меню"}
        >
          <span className="hamburger-icon">☰</span>
        </button>
        {selectedChat && (
          <div className="navbar-title">
            {selectedChat.name}
          </div>
        )}
      </div>
      <div className="navbar-right">
        <div className="user-profile navbar-profile">
          <span className="username">{currentUser.username}</span>
          <div className="avatar">{currentUser.avatar}</div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;