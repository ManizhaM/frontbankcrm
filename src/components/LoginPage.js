import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5094/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        // Пытаемся получить сообщение об ошибке из ответа
        let errorMessage = 'Неверное имя пользователя или пароль';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // Если не удалось разобрать JSON, используем статус код
          errorMessage = `Ошибка: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        fullName: data.fullName || data.username,
        role: data.role || 'operator'
      }));
      
      // Передаем данные пользователя в родительский компонент
      onLogin({
        id: data.id,
        username: data.username,
        fullName: data.fullName || data.username,
        role: data.role || 'operator',
        token: data.token
      });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Ошибка при входе в систему');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Telegram Чат-Бот</h1>
          <p>Панель оператора</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;