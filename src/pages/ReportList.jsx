import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Filter } from 'lucide-react';

const ReportList = () => {
  const reports = [
    { id: 'REP-001', deviceId: 'TM-012', date: '2026-05-24', status: 'Selesai', technician: 'Budi Santoso' },
    { id: 'REP-002', deviceId: 'TM-008', date: '2026-05-23', status: 'Pending', technician: 'Andi Wijaya' },
    { id: 'REP-003', deviceId: 'TM-045', date: '2026-05-21', status: 'Proses', technician: 'Siti Aminah' },
    { id: 'REP-004', deviceId: 'TM-022', date: '2026-05-20', status: 'Selesai', technician: 'Budi Santoso' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Daftar Laporan</h1>
          <p className="text-secondary">Riwayat pemeliharaan perangkat telemetri</p>
        </div>
        <Button variant="primary">Export Data</Button>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" className="input-field" placeholder="Cari ID Perangkat..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <Button variant="secondary"><Filter size={18} style={{ marginRight: '8px' }} /> Filter</Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID Laporan</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Perangkat</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tanggal</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Teknisi</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{report.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{report.deviceId}</td>
                  <td style={{ padding: '1rem' }}>{report.date}</td>
                  <td style={{ padding: '1rem' }}>{report.technician}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge ${report.status === 'Selesai' ? 'status-success' : report.status === 'Pending' ? 'status-warning' : 'status-info'}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <style>{`
        .status-success { background-color: rgba(16, 185, 129, 0.2); color: var(--success); }
        .status-warning { background-color: rgba(245, 158, 11, 0.2); color: var(--warning); }
        .status-info { background-color: rgba(59, 130, 246, 0.2); color: var(--accent); }
      `}</style>
    </div>
  );
};

export default ReportList;