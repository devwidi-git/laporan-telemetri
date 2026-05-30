import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Archive as ArchiveIcon, CalendarX, FileText } from 'lucide-react';
import { WS_LIST } from '../data/mockData';
import './ArchivePage.css';

const DECOMMISSIONED_STATIONS = [
  { id: 'NODE-OBS-001', name: 'Old Bridge Sensor (Deprecated)', type: 'AWLR', ws: 'brantas', decommissionDate: '2022-05-12', reason: 'Jembatan runtuh, alat hilang' },
  { id: 'NODE-OBS-015', name: 'Legacy ARR Station', type: 'ARR', ws: 'bengawan-solo', decommissionDate: '2023-01-10', reason: 'Diganti dengan model terbaru di lokasi baru' },
  { id: 'NODE-OBS-044', name: 'River Point A (Trial)', type: 'WQMS', ws: 'jratun-seluna', decommissionDate: '2023-08-22', reason: 'Masa uji coba selesai' },
];

const ArchivePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('laporan');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inventory/all`)
      .then(res => res.json())
      .then(data => {
        setStations(data.stations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allHistoricalReports = [];
  stations.forEach(station => {
    const regionName = WS_LIST.find(w => w.id === station.ws)?.name || station.ws;
    if (station.reports && station.reports.length > 0) {
      station.reports.forEach(report => {
        allHistoricalReports.push({
          ...report,
          stationId: station.id,
          stationName: station.name,
          stationType: station.type,
          ws: station.ws,
          regionName: regionName
        });
      });
    }
  });

  allHistoricalReports.sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

  const filteredReports = allHistoricalReports.filter(report => {
    const q = searchQuery.toLowerCase();
    return (
      report.stationName.toLowerCase().includes(q) ||
      report.type.toLowerCase().includes(q) ||
      report.signer.toLowerCase().includes(q) ||
      report.id.toLowerCase().includes(q) ||
      report.regionName.toLowerCase().includes(q)
    );
  });

  const filteredDecommissioned = DECOMMISSIONED_STATIONS.filter(station => {
    const q = searchQuery.toLowerCase();
    return (
      station.name.toLowerCase().includes(q) ||
      station.id.toLowerCase().includes(q) ||
      station.reason.toLowerCase().includes(q)
    );
  });

  return (
    <div className="archive-page animate-fade-in">
      <div className="archive-header">
        <div className="archive-title-container">
          <ArchiveIcon size={32} className="archive-icon-main" />
          <div>
            <h1 className="page-title">Sistem Arsip Terpusat</h1>
            <p className="page-subtitle">
              Pusat penyimpanan data historis untuk seluruh stasiun dan laporan jangka panjang.
            </p>
          </div>
        </div>
      </div>

      <div className="archive-tabs">
        <button 
          className={`tab-btn ${activeTab === 'laporan' ? 'active' : ''}`}
          onClick={() => setActiveTab('laporan')}
        >
          <FileText size={18} /> Laporan Historis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stasiun' ? 'active' : ''}`}
          onClick={() => setActiveTab('stasiun')}
        >
          <CalendarX size={18} /> Stasiun Non-Aktif
        </button>
      </div>

      <div className="archive-content card">
        <div className="archive-toolbar">
          <div className="search-box">
            <Search size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder={activeTab === 'laporan' ? "Cari Laporan, Stasiun, Wilayah..." : "Cari Stasiun Non-Aktif..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {activeTab === 'laporan' && (
            <div className="date-filter-box">
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                title="Pilih tanggal laporan"
              />
              <button className="btn-outline">
                <Filter size={16} /> Filter Lanjutan
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading archive...</div>
        ) : (
          <>
            {activeTab === 'laporan' && (
              <div className="table-wrapper">
                <table className="registry-table">
                  <thead>
                    <tr>
                      <th>TANGGAL & WAKTU</th>
                      <th>WILAYAH SUNGAI</th>
                      <th>STASIUN</th>
                      <th>JENIS LAPORAN</th>
                      <th>STATUS</th>
                      <th>PETUGAS / PELAKSANA</th>
                      <th className="text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td className="text-secondary font-medium">
                            {new Date(report.timestamp).toLocaleString()}
                          </td>
                          <td className="font-semibold text-primary">
                            {report.regionName}
                          </td>
                          <td>
                            <div className="font-semibold">{report.stationName}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>ID: {report.stationId}</div>
                          </td>
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
                              className="btn-outline btn-sm"
                              onClick={() => navigate(`/inventory/${report.ws}/report/${report.stationId}/${report.id}`)}
                            >
                              Buka Dokumen
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-secondary py-8">
                          Belum ada laporan yang tersedia atau tidak ada hasil pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'stasiun' && (
              <div className="table-wrapper">
                <table className="registry-table">
                  <thead>
                    <tr>
                      <th>NODE ID</th>
                      <th>NAMA STASIUN LAMA</th>
                      <th>WILAYAH</th>
                      <th>TGL NON-AKTIF</th>
                      <th>ALASAN DECOMMISSION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDecommissioned.length > 0 ? (
                      filteredDecommissioned.map((station) => (
                        <tr key={station.id}>
                          <td className="font-medium text-primary">
                            {station.id}
                          </td>
                          <td>
                            <div className="font-semibold">{station.name}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Tipe: {station.type}</div>
                          </td>
                          <td style={{textTransform: 'capitalize'}}>{station.ws.replace('-', ' ')}</td>
                          <td className="text-secondary font-medium">{station.decommissionDate}</td>
                          <td>
                            <span style={{color: '#ef4444', fontStyle: 'italic'}}>{station.reason}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-secondary py-8">
                          Tidak ada stasiun non-aktif yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;