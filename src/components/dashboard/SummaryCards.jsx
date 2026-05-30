import { Share2, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import './SummaryCards.css';

const SummaryCards = ({ data }) => {
  const { totalStations, activeNodes, offlineCount, maintCount, systemHealth } = data || {};

  return (
    <div className="summary-cards">
      <div className="summary-card card">
        <div className="card-header">
          <div className="icon-wrapper blue">
            <Share2 size={24} />
          </div>
        </div>
        <div className="card-body">
          <p className="card-label">Total Stations</p>
          <h3 className="card-value">{totalStations ?? 0}</h3>
        </div>
      </div>

      <div className="summary-card card">
        <div className="card-header">
          <div className="icon-wrapper blue">
            <Activity size={24} />
          </div>
        </div>
        <div className="card-body">
          <p className="card-label">Active Stations</p>
          <h3 className="card-value">{activeNodes ?? 0}</h3>
        </div>
      </div>

      <div className="summary-card card">
        <div className="card-header">
          <div className="icon-wrapper orange">
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="card-body">
          <p className="card-label">Maint. Due Soon</p>
          <h3 className="card-value">{maintCount ?? 0}</h3>
        </div>
      </div>

      <div className="summary-card card">
        <div className="card-header">
          <div className="icon-wrapper orange" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="card-body">
          <p className="card-label">Overdue</p>
          <h3 className="card-value">{offlineCount ?? 0}</h3>
        </div>
      </div>

      <div className="summary-card card health-card">
        <div className="card-header">
          <div className="icon-wrapper green">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="card-body">
          <p className="card-label">System Health</p>
          <h3 className="card-value">{systemHealth ?? 100}%</h3>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;