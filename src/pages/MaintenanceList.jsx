import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { WS_LIST } from '../data/mockData';
import StationRegistryTable from '../components/dashboard/StationRegistryTable';
import './MaintenanceList.css';

const MaintenanceList = () => {
  const { ws, type } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const currentWs = WS_LIST.find(w => w.id === ws);
  const upperType = type.toUpperCase();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inventory/${ws}`)
      .then(res => res.json())
      .then(data => {
        setStations(data.stations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ws]);
  
  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading data...</div>;
  }

  // Security check: if the user tries to access a different WS (after hooks)
  if (user.ws !== ws && !['super-admin', 'verifier'].includes(user.role)) {
    return <Navigate to={`/maintenance/${user.ws}/${type}`} replace />;
  }

  if (!currentWs) {
    return <div>Wilayah Sungai tidak ditemukan</div>;
  }
  
  // Filter stations based on the type (ARR, AWLR, WQMS)
  const filteredStations = stations.filter(station => station.type === upperType);

  // If user is verifier, they should see a list of reports to verify, not the station registry
  const isVerifier = user.role === 'verifier';
  
  // Verifier hanya melihat laporan dengan status Pending
  let verifierReports = [];
  if (isVerifier) {
    filteredStations.forEach(station => {
      if (station.reports && station.reports.length > 0) {
        station.reports.forEach(report => {
          // Filter hanya laporan Pending
          if (report.status === 'Pending') {
            verifierReports.push({
              ...report,
              stationId: station.id,
              stationName: station.name
            });
          }
        });
      }
    });
  }

  return (
    <div className="maintenance-page animate-fade-in">
      <div className="page-breadcrumb">
        <span>MAINTENANCE</span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">{currentWs.name.toUpperCase()} RIVER BASIN</span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">{upperType} STATIONS</span>
      </div>

      <div className="page-header">
        <h1>{upperType} {isVerifier ? 'Verification Tasks' : 'Maintenance Registry'}</h1>
        <p className="page-description">
          {isVerifier 
            ? `Menampilkan seluruh laporan stasiun ${upperType} yang menunggu verifikasi pada wilayah sungai ${currentWs.name}.`
            : `Menampilkan seluruh daftar stasiun ${upperType} yang dikelola pada wilayah sungai ${currentWs.name}.`
          }
        </p>
      </div>

      {isVerifier ? (
        // Verifier View: List of Reports
        verifierReports.length > 0 ? (
          <div className="card report-table-container">
            <table className="registry-table">
              <thead>
                <tr>
                  <th>ID LAPORAN</th>
                  <th>STASIUN</th>
                  <th>JENIS LAPORAN</th>
                  <th>STATUS</th>
                  <th>PETUGAS / PELAKSANA</th>
                  <th className="text-right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {verifierReports.map(report => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td>{report.stationName}</td>
                    <td>
                      <span className={`type-badge ${report.type === 'Maintenance' ? 'bg-green' : 'bg-orange'}`}>
                        {report.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${report.status === 'Approved' ? 'approved' : report.status === 'Declined' ? 'declined' : 'pending'}`}>
                        {report.status || 'Pending'}
                      </span>
                    </td>
                    <td>{report.signer}</td>
                    <td className="text-right">
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => navigate(`/inventory/${ws}/report/${report.stationId}/${report.id}`)}
                      >
                        <FileText size={14} style={{ marginRight: '6px', display: 'inline' }} />
                        Buka Dokumen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Belum ada laporan {upperType} yang tersedia untuk diverifikasi.</p>
          </div>
        )
      ) : (
        // Standard View: Station Registry
        filteredStations.length > 0 ? (
          <StationRegistryTable stations={filteredStations} />
        ) : (
          <div className="empty-state">
            <p>Belum ada data stasiun {upperType} yang terdaftar.</p>
          </div>
        )
      )}
    </div>
  );
};

export default MaintenanceList;
