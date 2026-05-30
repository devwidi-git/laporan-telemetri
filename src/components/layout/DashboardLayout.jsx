import { useState } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

const DashboardLayout = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      <Sidebar user={user} />
      <div className="main-content-wrapper">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
