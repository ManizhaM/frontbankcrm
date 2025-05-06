import React, { useState, useRef, useEffect } from 'react';

function ChatPanel({ selectedChat, messages, onSendMessage, currentUser, loading }) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  
  // Автоматическая прокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
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
  
  // Если чат не выбран, показываем пустое состояние
  if (!selectedChat) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-icon">💬</div>
        <div className="empty-chat-text">Выберите чат для начала общения</div>
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
        <div className="chat-actions">
          <button className="action-button info-button" title="Информация о чате">
            ℹ️
          </button>
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
    </div>
  );
}

export default ChatPanel;