import Card from '../components/ui/Card';
import './Dashboard.css';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Perangkat', value: '124', icon: <Activity color="var(--accent)" />, color: 'var(--accent)' },
    { title: 'Perlu Pemeliharaan', value: '12', icon: <AlertTriangle color="var(--warning)" />, color: 'var(--warning)' },
    { title: 'Sedang Diperbaiki', value: '5', icon: <Clock color="var(--danger)" />, color: 'var(--danger)' },
    { title: 'Selesai Bulan Ini', value: '38', icon: <CheckCircle color="var(--success)" />, color: 'var(--success)' },
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard Telemetri</h1>
        <p className="text-secondary">Ringkasan status pemeliharaan perangkat telemetri.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-content">
        <Card className="chart-card">
          <h2>Aktivitas Pemeliharaan</h2>
          <div className="mock-chart">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '40%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
            <div className="chart-bar" style={{ height: '50%' }}></div>
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '100%' }}></div>
          </div>
        </Card>
        
        <Card className="list-card">
          <h2>Laporan Terbaru</h2>
          <div className="recent-reports">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="report-item">
                <div className="report-info">
                  <h4>Perangkat TM-0{item}</h4>
                  <p>Sensor tidak merespon</p>
                </div>
                <span className="status-badge status-pending">Pending</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;