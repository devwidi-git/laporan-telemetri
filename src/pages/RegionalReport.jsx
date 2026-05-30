import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, Navigate } from 'react-router-dom';
import { Download, ChevronDown, Wrench, Settings, MapPin, AlertCircle, Search } from 'lucide-react';
import { WS_LIST } from '../data/mockData';
import './RegionalReport.css';

const RegionalReport = () => {
  const { ws } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  
  const currentWs = WS_LIST.find(w => w.id === ws);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

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

  if (user && user.ws !== ws && !['super-admin', 'verifier'].includes(user.role)) {
    return <Navigate to={`/regional-reports/${user.ws}`} replace />;
  }

  if (!currentWs || !stations) {
    return (
      <div className="regional-report-page animate-fade-in">
        <div className="empty-state">Data Wilayah Sungai tidak ditemukan.</div>
      </div>
    );
  }

  const toggleAccordion = (stationId) => {
    setOpenAccordion(openAccordion === stationId ? null : stationId);
  };

  const getQuarter = (dateStr) => {
    const d = new Date(dateStr);
    const m = d.getMonth();
    if (m < 3) return 'Triwulan I';
    if (m < 6) return 'Triwulan II';
    if (m < 9) return 'Triwulan III';
    return 'Triwulan IV';
  };

  // Filter stations and reports based on search query
  const searchLower = searchQuery.toLowerCase();
  const filteredData = stations.map(station => {
    const isStationMatch = station.name.toLowerCase().includes(searchLower) || station.id.toLowerCase().includes(searchLower);
    
    const matchingReports = (station.reports || []).filter(report => {
      const typeStr = report.type === 'Maintenance' ? 'pemeliharaan' : 'perbaikan';
      const dateStr = new Date(report.timestamp).toLocaleDateString().toLowerCase();
      const quarterStr = getQuarter(report.timestamp).toLowerCase();
      
      return typeStr.includes(searchLower) || dateStr.includes(searchLower) || quarterStr.includes(searchLower);
    });

    // Show all reports if station name matches, else show only matching reports
    const reportsToShow = isStationMatch ? (station.reports || []) : matchingReports;

    return {
      ...station,
      reportsToShow,
      isMatch: isStationMatch || matchingReports.length > 0
    };
  }).filter(s => s.isMatch);

  return (
    <div className="regional-report-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Log Book Pemeliharaan & Perbaikan</h1>
          <p className="page-subtitle">Wilayah Sungai: <strong>{currentWs.name.toUpperCase()}</strong></p>
        </div>
        <button className="btn-primary no-print" onClick={() => window.print()}>
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="search-filter-container no-print">
        <div className="search-bar-log">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama stasiun, jenis laporan, atau tanggal..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="logbook-container">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada hasil yang cocok dengan pencarian "{searchQuery}"</p>
          </div>
        ) : (
          filteredData.map(station => {
            // Sort reports for this station descending by date
            const sortedReports = [...(station.reportsToShow || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            return (
              <div key={station.id} className={`station-accordion ${openAccordion === station.id ? 'open' : ''}`}>
                <div className="accordion-header" onClick={() => toggleAccordion(station.id)}>
                  <div className="station-info">
                    <h3>{station.name}</h3>
                    <div className="station-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {station.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="station-badges">
                    <span className="type-badge bg-blue">{station.type}</span>
                    <span className="count-badge">{sortedReports.length} Laporan</span>
                    <ChevronDown size={20} className="chevron-icon" />
                  </div>
                </div>

                {openAccordion === station.id && (
                  <div className="accordion-body animate-fade-in">
                    <div className="timeline-container">
                      {sortedReports.length > 0 ? (
                        <div className="timeline">
                          {sortedReports.map(report => (
                            <div key={report.id} className={`timeline-item ${report.type === 'Maintenance' ? 'maintenance' : 'repair'}`}>
                              <div className="timeline-icon">
                                {report.type === 'Maintenance' ? <Settings size={16} /> : <Wrench size={16} />}
                              </div>
                              <div className="timeline-content">
                                <div>
                                  <div className="timeline-date">
                                    {getQuarter(report.timestamp)} • {new Date(report.timestamp).toLocaleDateString()}
                                  </div>
                                  <h4 className="timeline-title">Laporan {report.type === 'Maintenance' ? 'Pemeliharaan' : 'Perbaikan'}</h4>
                                  <div className="timeline-details">
                                    <span>Oleh: {report.signer}</span>
                                  </div>
                                </div>
                                <div className="timeline-actions">
                                  <span className={`status-badge ${report.status === 'Approved' ? 'approved' : report.status === 'Declined' ? 'declined' : 'pending'}`}>
                                    {report.status || 'Pending'}
                                  </span>
                                  <button 
                                    className="btn-outline btn-sm mt-2"
                                    onClick={() => navigate(`/inventory/${ws}/report/${station.id}/${report.id}`)}
                                  >
                                    Buka Dokumen
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-history">
                          <AlertCircle size={32} />
                          <p>Belum ada riwayat laporan (Log Book) untuk stasiun ini.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RegionalReport;
