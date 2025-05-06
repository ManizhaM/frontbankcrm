
// src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ chat, messages, onSendMessage, userName }) {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  if (!chat) {
    return (
      <div className="chat-window empty-state">
        <div className="select-chat-message">
          Выберите чат, чтобы начать общение
        </div>
      </div>
    );
  }
  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{chat.name}</h2>
      </div>
      
      <MessageList messages={messages} currentUser={userName} />
      <div ref={messagesEndRef} />
      
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}

export default ChatWindow;
