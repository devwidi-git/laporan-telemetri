import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import AddStation from './pages/AddStation';
import MaintenanceList from './pages/MaintenanceList';
import MaintenanceForm from './pages/MaintenanceForm';
import RepairForm from './pages/RepairForm';
import ReportViewer from './pages/ReportViewer';
import RegionalReport from './pages/RegionalReport';
import ArchivePage from './pages/ArchivePage';
import SupportPage from './pages/SupportPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/inventory/brantas" replace />} />
          <Route path="inventory/:ws" element={<Inventory />} />
          <Route path="inventory/:ws/add-station" element={<AddStation />} />
          <Route path="inventory/:ws/report/:stationId/:reportId" element={<ReportViewer />} />
          <Route path="maintenance/:ws/:type" element={<MaintenanceList />} />
          <Route path="maintenance/:ws/form-pemeliharaan/:stationId" element={<MaintenanceForm />} />
          <Route path="maintenance/:ws/form-perbaikan/:stationId" element={<RepairForm />} />
          <Route path="regional-reports/:ws" element={<RegionalReport />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
