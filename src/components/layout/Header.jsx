import { Search, Bell, Settings, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <h1>HydroTelemetry Admin</h1>
      </div>
      
      <div className="header-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search Node ID..." />
        </div>
        
        <div className="header-actions">
          <button className="action-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <button className="action-btn">
            <Settings size={20} />
          </button>
          <div className="user-profile-container">
            <div className="user-profile">
              <div className="avatar">
                {user?.name.charAt(0)}
              </div>
              <span className="user-name" style={{ marginLeft: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {user?.name}
              </span>
            </div>
            <button className="action-btn logout-btn" onClick={onLogout} title="Logout" style={{ marginLeft: '8px', color: 'var(--danger)' }}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
