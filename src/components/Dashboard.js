import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Дашборд</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">Активные чаты</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Сообщения сегодня</div>
          <div className="stat-value">48</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Среднее время ответа</div>
          <div className="stat-value">3м 24с</div>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="chart">
          <h3>Активность по дням</h3>
          <div className="chart-placeholder">График активности (заглушка)</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;