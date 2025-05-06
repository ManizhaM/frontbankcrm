import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './App.css';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import UserManagement from './components/UserManagement';

function App() {
  // Состояние авторизации и пользователя
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Состояние соединения SignalR
  const [connection, setConnection] = useState(null);
  
  // Данные приложения
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeSection, setActiveSection] = useState('chats'); // chats, dashboard, settings, users
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (authToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser({
          ...user,
          avatar: user.username.charAt(0).toUpperCase()
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Ошибка при разборе данных пользователя:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Запрашиваем разрешение на уведомления при загрузке приложения
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);
  
  // Эффект для подключения к SignalR при авторизации
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const connectToSignalR = async () => {
        try {
          const token = localStorage.getItem('authToken');
          
          const newConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5094/chatHub", {
              accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();
          
          newConnection.on("ReceiveMessage", (text, chatId) => {
            // Проверяем, открыт ли сейчас этот чат
            if (selectedChat && selectedChat.id === parseInt(chatId)) {
              // Если это текущий выбранный чат, добавляем сообщение в его историю
              setMessages(prevMessages => [
                ...prevMessages, 
                { 
                  text, 
                  type: 1, // type: 1 = входящее сообщение от пользователя
                  timestamp: new Date().toISOString(),
                  isRead: false
                }
              ]);
              
              // И отмечаем сообщения как прочитанные через API
              fetchWithAuth(`http://localhost:5094/api/telegrambot/chat/${chatId}/markAsRead`, {
                method: 'POST'
              });
            } else {
              // Если это другой чат, обновляем счетчик непрочитанных сообщений
              setChats(prevChats => 
                prevChats.map(chat => 
                  chat.id === parseInt(chatId) 
                    ? { ...chat, unread: true, unreadCount: (chat.unreadCount || 0) + 1 } 
                    : chat
                )
              );
              
              // Воспроизводим звук уведомления
              playNotificationSound();
              
              // Показываем браузерное уведомление
              showBrowserNotification(`Новое сообщение в чате`, text);
            }
          });
          
          // Обработчик события для обновления списка чатов
          newConnection.on("ChatListUpdated", () => {
            // Обновляем список чатов
            fetchChats();
          });
          
          await newConnection.start();
          console.log('SignalR connection established');
          setConnection(newConnection);
          
          // Загружаем чаты после подключения
          fetchChats();
        } catch (error) {
          console.error('SignalR connection error:', error);
          setError('Ошибка подключения к серверу чата');
        }
      };
      
      connectToSignalR();
    }
    
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [isAuthenticated, currentUser]);
  
  // Периодическое обновление списка чатов
  useEffect(() => {
    if (isAuthenticated) {
      // Устанавливаем интервал обновления списка чатов каждые 30 секунд
      const chatUpdater = setInterval(() => {
        fetchChats();
      }, 30000);
      
      // Очищаем интервал при размонтировании
      return () => clearInterval(chatUpdater);
    }
  }, [isAuthenticated]);
  
  // Функция для выполнения запросов с авторизацией
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Нет токена авторизации');
    }
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Токен истек или невалиден
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    
    return response;
  };
  
  // Функция для воспроизведения звука уведомления
  const playNotificationSound = () => {
    // Можно заменить на свой звук или использовать звук по умолчанию
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
  };
  
  // Функция для отображения браузерного уведомления
  const showBrowserNotification = (title, body) => {
    // Проверяем поддержку уведомлений браузером
    if (!("Notification" in window)) {
      console.log("Этот браузер не поддерживает уведомления");
      return;
    }
    
    // Проверяем разрешения
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } 
    // Если разрешение еще не дано, запрашиваем его
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  };
  
  // Загрузка списка чатов
  const fetchChats = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('http://localhost:5094/api/telegrambot/chats');
      if (!response.ok) {
        throw new Error('Ошибка загрузки чатов');
      }
      const data = await response.json();
      
      // Сохраняем текущие данные о непрочитанных сообщениях
      setChats(prevChats => {
        // Если это первая загрузка, просто используем данные с сервера
        if (prevChats.length === 0) return data;
        
        // Иначе сохраняем счетчики непрочитанных сообщений из текущего состояния
        return data.map(newChat => {
          const existingChat = prevChats.find(c => c.id === newChat.id);
          // Если чат уже существует, сохраняем его счетчик, иначе берем с сервера
          return {
            ...newChat,
            unreadCount: existingChat ? existingChat.unreadCount : newChat.unreadCount || 0,
            unread: existingChat ? existingChat.unread : newChat.unread || false
          };
        });
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError(error.message || 'Ошибка загрузки списка чатов');
      
      if (error.message === 'Сессия истекла. Пожалуйста, войдите снова.') {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработка выбора чата
  useEffect(() => {
    if (selectedChat && connection && isAuthenticated) {
      setIsLoading(true);
      
      // Загружаем сообщения выбранного чата
      fetchWithAuth(`http://localhost:5094/api/telegrambot/chat/${selectedChat.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Ошибка загрузки сообщений');
          }
          return response.json();
        })
        .then(data => {
          setMessages(data);
          setIsLoading(false);
          
          // Отмечаем сообщения как прочитанные
          return fetchWithAuth(`http://localhost:5094/api/telegrambot/chat/${selectedChat.id}/markAsRead`, {
            method: 'POST'
          });
        })
        .then(() => {
          // Обнуляем счетчик непрочитанных для выбранного чата
          setChats(prevChats => 
            prevChats.map(chat => 
              chat.id === selectedChat.id 
                ? { ...chat, unread: false, unreadCount: 0 } 
                : chat
            )
          );
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
          setError(error.message || 'Ошибка загрузки сообщений');
          setIsLoading(false);
          
          if (error.message === 'Сессия истекла. Пожалуйста, войдите снова.') {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        });
      
      // Присоединяемся к группе SignalR
      connection.invoke("JoinChat", selectedChat.id)
        .catch(err => {
          console.error("Error joining chat:", err);
          setError('Ошибка подключения к чату');
        });
    }
  }, [selectedChat, connection, isAuthenticated]);
  
  // Обработка авторизации
  const handleLogin = (userData) => {
    setCurrentUser({
      ...userData,
      avatar: userData.username.charAt(0).toUpperCase()
    });
    setIsAuthenticated(true);
  };
  
  // Обработка выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedChat(null);
    setMessages([]);
    
    if (connection) {
      connection.stop();
      setConnection(null);
    }
  };
  
  // Отправка сообщения
  const handleSendMessage = async (text) => {
    if (connection && text.trim() && selectedChat && isAuthenticated) {
      try {
        await connection.invoke("SendMessageToChat", selectedChat.id, currentUser.username, text);
        
        // Добавляем наше сообщение в список сразу, не дожидаясь ответа от сервера
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            text, 
            type: 0, // type: 0 = наше сообщение (от оператора)
            timestamp: new Date().toISOString(),
            isRead: true 
          }
        ]);
      } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        setError('Ошибка отправки сообщения');
      }
    }
  };
  
  // Выбор раздела в боковой панели
  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section !== 'chats') {
      setSelectedChat(null);
    }
  };
  
  // Если пользователь не авторизован, показываем страницу входа
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  // Определяем, какой контент показывать в зависимости от выбранного раздела
  const renderContent = () => {
    switch (activeSection) {
      case 'chats':
        return (
          <ChatPanel 
            selectedChat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            loading={isLoading}
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsPanel />;
      case 'users':
        return <UserManagement />;
      default:
        return <div className="empty-content">Выберите раздел</div>;
    }
  };
  
  return (
    <div className="app-container">
      {error && (
        <div className="error-notification">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="main-layout">
        <Sidebar 
          currentUser={currentUser}
          onLogout={handleLogout}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;