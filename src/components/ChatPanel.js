// ChatPanel.js - Компонент панели чата с выпадающим меню действий
import React, { useState, useRef, useEffect } from 'react';
import TransferChatModal from './modals/TransferChatModal';

function ChatPanel({ selectedChat, messages, onSendMessage, currentUser, loading }) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для отслеживания открытия/закрытия меню

  // Реф для отслеживания клика вне выпадающего меню
  const menuRef = useRef(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // Автоматическая прокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Эффект для закрытия меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Форматирование времени сообщения
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Обработка отправки сообщения
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  // Обработчики действий меню
  const handleSetTopic = () => {
    // Здесь можно добавить логику для установки темы чата
    console.log('Установка темы для чата', selectedChat.id);
    setMenuOpen(false);
  };

  const handleTransferChat = () => {
    setMenuOpen(false);
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = (transferData) => {
    console.log('Передача чата:', transferData);
    // Здесь будет ваш API-вызов для передачи чата
  };

  const handleCloseChat = () => {
    // Здесь можно добавить логику для закрытия чата
    console.log('Закрытие чата', selectedChat.id);
    setMenuOpen(false);
  };

  // Если чат не выбран, показываем пустое состояние
  if (!selectedChat) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-content">
          <div className="empty-chat-icon">💬</div>
          <div className="empty-chat-text">Выберите чат для начала общения</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-info">
          <h2>{selectedChat.name}</h2>
          {selectedChat.phoneNumber && (
            <div className="chat-phone">📱 {selectedChat.phoneNumber}</div>
          )}
        </div>
        <div className="chat-actions" ref={menuRef}>
          <button
            className="action-button info-button"
            title="Информация о чате"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ℹ️
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleSetTopic}>
                <i className="dropdown-icon">📝</i>
                <span>Задать тему чата</span>
              </div>
              <div className="dropdown-item" onClick={handleTransferChat}>
                <i className="dropdown-icon">📤</i>
                <span>Перенаправить оператору</span>
              </div>
              <div className="dropdown-item" onClick={handleCloseChat}>
                <i className="dropdown-icon">🔒</i>
                <span>Закрыть чат</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">В этом чате пока нет сообщений</div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Определяем, является ли сообщение отправленным оператором
              // type: 0 - от оператора (мы), type: 1 - от пользователя
              const isFromOperator = message.type === 0;

              return (
                <div
                  key={message.id || index}
                  className={`message ${isFromOperator ? 'message-outgoing' : 'message-incoming'}`}
                >
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-author">
                        {isFromOperator ? currentUser.username : 'Пользователь'}
                      </span>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="message-input-container">
        <div className="message-input">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите сообщение..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
          >
            Отправить
          </button>
        </div>
      </div>
      <TransferChatModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleTransferSubmit}
        chatId={selectedChat.id}
      />
    </div>
  );
}

export default ChatPanel;