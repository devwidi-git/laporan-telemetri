import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings2, 
  FileBarChart, 
  HelpCircle, 
  Archive,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './Sidebar.css';
import { WS_LIST } from '../../data/mockData';

const Sidebar = ({ user }) => {
  const [inventoryOpen, setInventoryOpen] = React.useState(true);
  const [maintenanceOpen, setMaintenanceOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="logo-icon"></div>
        </div>
        <div className="brand-text">
          <h2>TELEMETRI</h2>
          <p>Technical Operations</p>
        </div>
      </div>

      <div className="sidebar-action">
        <NavLink to={`/inventory/${user.ws}/add-station`} className="btn-add-station">
          <Plus size={18} /> Add New Station
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <div 
            className={`nav-item-header ${inventoryOpen ? 'active' : ''}`}
            onClick={() => setInventoryOpen(!inventoryOpen)}
          >
            <div className="nav-item-title">
              <LayoutDashboard size={20} />
              <span>Inventory</span>
            </div>
            {inventoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {inventoryOpen && (
            <div className="nav-subitems">
              {WS_LIST.map((ws) => (
                <NavLink 
                  key={ws.id} 
                  to={`/inventory/${ws.id}`}
                  className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''} ${user.ws !== ws.id && !['super-admin', 'verifier'].includes(user.role) ? 'disabled' : ''}`}
                  onClick={(e) => {
                    if (user.ws !== ws.id && !['super-admin', 'verifier'].includes(user.role)) e.preventDefault();
                  }}
                >
                  {ws.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="nav-group">
          <div 
            className={`nav-item-header ${maintenanceOpen ? 'active' : ''}`}
            onClick={() => setMaintenanceOpen(!maintenanceOpen)}
          >
            <div className="nav-item-title">
              <Settings2 size={20} />
              <span>Maintenance</span>
            </div>
            {maintenanceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {maintenanceOpen && (
            <div className="nav-subitems">
              {['super-admin', 'verifier'].includes(user.role) ? (
                WS_LIST.map((wsItem) => (
                  <React.Fragment key={`maint-${wsItem.id}`}>
                    <div className="nav-subitem-title" style={{padding: '0.5rem 1rem 0.25rem 1.5rem', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600}}>
                      {wsItem.name}
                    </div>
                    <NavLink 
                      to={`/maintenance/${wsItem.id}/arr`} 
                      className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      style={{paddingLeft: '2.5rem'}}
                    >
                      ARR
                    </NavLink>
                    <NavLink 
                      to={`/maintenance/${wsItem.id}/awlr`} 
                      className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      style={{paddingLeft: '2.5rem'}}
                    >
                      AWLR
                    </NavLink>
                    <NavLink 
                      to={`/maintenance/${wsItem.id}/wqms`} 
                      className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      style={{paddingLeft: '2.5rem'}}
                    >
                      WQMS
                    </NavLink>
                  </React.Fragment>
                ))
              ) : (
                <React.Fragment>
                  <NavLink 
                    to={`/maintenance/${user.ws}/arr`} 
                    className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    ARR
                  </NavLink>
                  <NavLink 
                    to={`/maintenance/${user.ws}/awlr`} 
                    className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    AWLR
                  </NavLink>
                  <NavLink 
                    to={`/maintenance/${user.ws}/wqms`} 
                    className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    WQMS
                  </NavLink>
                </React.Fragment>
              )}
            </div>
          )}
        </div>

        <div className="nav-group">
          <div 
            className={`nav-item-header ${reportsOpen ? 'active' : ''}`}
            onClick={() => setReportsOpen(!reportsOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-item-title">
              <FileBarChart size={20} />
              <span>Regional Reports</span>
            </div>
            {reportsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {reportsOpen && (
            <div className="nav-subitems">
              {WS_LIST.map((ws) => (
                <NavLink 
                  key={`report-${ws.id}`} 
                  to={`/regional-reports/${ws.id}`}
                  className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''} ${user.ws !== ws.id && !['super-admin', 'verifier'].includes(user.role) ? 'disabled' : ''}`}
                  onClick={(e) => {
                    if (user.ws !== ws.id && !['super-admin', 'verifier'].includes(user.role)) e.preventDefault();
                  }}
                >
                  {ws.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

      </nav>

      <div className="sidebar-footer">
        <div className="nav-group">
          <NavLink 
            to="/support" 
            className={({ isActive }) => `nav-item-header ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="nav-item-title">
              <HelpCircle size={20} />
              <span>Support</span>
            </div>
          </NavLink>
          <NavLink 
            to="/archive" 
            className={({ isActive }) => `nav-item-header ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="nav-item-title">
              <Archive size={20} />
              <span>Archive</span>
            </div>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
