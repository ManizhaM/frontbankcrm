import React, { useState } from 'react';

function SettingsPanel() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  
  return (
    <div className="settings-panel">
      <h1>Настройки</h1>
      
      <div className="settings-section">
        <h3>Уведомления</h3>
        <div className="setting-item">
          <div className="setting-label">Уведомления о новых сообщениях</div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notificationEnabled}
              onChange={() => setNotificationEnabled(!notificationEnabled)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-label">Звуковые уведомления</div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Распределение чатов</h3>
        <div className="setting-item">
          <div className="setting-label">Автоматическое назначение операторов</div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={autoAssign}
              onChange={() => setAutoAssign(!autoAssign)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Шаблоны сообщений</h3>
        <button className="settings-button">Управление шаблонами</button>
      </div>
    </div>
  );
}

export default SettingsPanel;