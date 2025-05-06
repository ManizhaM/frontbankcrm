// TransferChatModal.js - Компонент модального окна для перенаправления чата другому оператору
import React, { useState, useEffect } from 'react';

function TransferChatModal({ isOpen, onClose, onTransfer, chatId }) {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  
  // Загрузка списка операторов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchOperators();
    }
  }, [isOpen]);
  
  // Функция для загрузки списка операторов
  const fetchOperators = async () => {
    setLoading(true);
    try {
      // Здесь должен быть ваш запрос к API
      // Например: const response = await fetch('/api/operators');
      
      // Пример данных, полученных от сервера
      const mockOperators = [
        { id: 1, name: 'Иванов Иван', role: 'Старший оператор', status: 'online' },
        { id: 2, name: 'Петров Петр', role: 'Оператор', status: 'online' },
        { id: 3, name: 'Сидорова Анна', role: 'Менеджер', status: 'busy' },
        { id: 4, name: 'Козлов Алексей', role: 'Оператор', status: 'offline' }
      ];
      
      setOperators(mockOperators);
    } catch (error) {
      console.error('Ошибка при загрузке списка операторов:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик выбора оператора
  const handleSelectOperator = (operator) => {
    setSelectedOperator(operator);
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedOperator) {
      alert('Выберите оператора для перенаправления');
      return;
    }
    
    onTransfer({
      chatId,
      operatorId: selectedOperator.id,
      comment
    });
    
    // Сброс формы
    setSelectedOperator(null);
    setComment('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Перенаправить чат другому оператору</h3>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">Загрузка списка операторов...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Выберите оператора:</label>
                <div className="operators-list">
                  {operators.map(operator => (
                    <div 
                      key={operator.id}
                      className={`operator-item ${selectedOperator && selectedOperator.id === operator.id ? 'selected' : ''} status-${operator.status}`}
                      onClick={() => handleSelectOperator(operator)}
                    >
                      <div className="operator-avatar">
                        {operator.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="operator-info">
                        <div className="operator-name">{operator.name}</div>
                        <div className="operator-role">{operator.role}</div>
                      </div>
                      <div className={`operator-status ${operator.status}`}>
                        {operator.status === 'online' ? 'Онлайн' : 
                         operator.status === 'busy' ? 'Занят' : 'Офлайн'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="transfer-comment">Комментарий к передаче:</label>
                <textarea
                  id="transfer-comment"
                  className="transfer-comment"
                  placeholder="Укажите причину перенаправления или другую важную информацию..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!selectedOperator}
                >
                  Перенаправить
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferChatModal;