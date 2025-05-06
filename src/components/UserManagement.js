import React, { useState } from 'react';

function UserManagement() {
  const [users] = useState([
    { id: 1, username: 'operator1', role: 'Оператор', status: 'active' },
    { id: 2, username: 'operator2', role: 'Оператор', status: 'inactive' },
    { id: 3, username: 'admin', role: 'Администратор', status: 'active' }
  ]);
  
  return (
    <div className="user-management">
      <h1>Управление пользователями</h1>
      
      <div className="user-action-bar">
        <button className="settings-button">Добавить пользователя</button>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя пользователя</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td>
                  <button className="table-action edit">✏️</button>
                  <button className="table-action delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;