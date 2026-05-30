import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filter, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateStationStatus } from '../../utils/statusHelper';
import './StationRegistryTable.css';

const StatusDisplay = ({ className }) => {
  if (className === 'active') {
    return (
      <div className="status-display">
        <span className="status-dot active"></span>
        <span className="status-text-normal">Active</span>
      </div>
    );
  }
  if (className === 'maint') {
    return (
      <div className="status-display">
        <span className="status-dot maint"></span>
        <span className="status-text-normal">Maint.</span>
      </div>
    );
  }
  if (className === 'overdue') {
    return (
      <div className="status-display status-pill-danger">
        <span className="status-dot offline"></span>
        <span className="status-text-danger-pill">Offline</span>
      </div>
    );
  }
  return <span>{className}</span>;
};

const StationRegistryTable = ({ stations }) => {
  const navigate = useNavigate();
  const { ws } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openMenu, setOpenMenu] = useState(null);

  const indexOfLast  = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStations = stations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(stations.length / itemsPerPage);

  const paginate = (n) => setCurrentPage(n);

  /* Build page numbers with ellipsis */
  const buildPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="registry-container card">
      {/* ── Table Header ── */}
      <div className="registry-header">
        <h3 className="registry-title">TELEMETRY STATION</h3>
        <div className="registry-actions">
          <button className="btn-outline">
            <Filter size={14} />
            Filter
          </button>
          <button className="btn-outline">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="registry-table-wrapper">
        <table className="registry-table">
          <thead>
            <tr>
              <th>NODE ID</th>
              <th>STATION NAME</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>LAST MAINTENANCE</th>
              <th className="th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentStations.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No stations found.</td>
              </tr>
            ) : (
              currentStations.map((station, index) => {
                const status = calculateStationStatus(station.dateMaintenance);
                const isMenuOpen = openMenu === station.id;
                const isOffline = status.className === 'overdue';
                
                // If it's one of the last two rows and there are more than 2 rows, pop the menu UP to avoid cutoff
                const popUpward = index >= currentStations.length - 2 && currentStations.length > 2;

                return (
                  <tr key={station.id} className="table-row">
                    {/* NODE ID */}
                    <td className={`node-id-cell ${isOffline ? 'text-danger font-semibold' : 'font-semibold'}`}>
                      {station.id}
                    </td>

                    {/* STATION NAME */}
                    <td>
                      <span
                        className="station-name-text font-bold"
                      >
                        {station.name}
                      </span>
                    </td>

                    {/* TYPE */}
                    <td>
                      <span className="type-badge">
                        {station.type}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <StatusDisplay className={status.className} />
                    </td>

                    {/* LAST MAINTENANCE */}
                    <td className={`last-maint-cell ${isOffline ? 'text-danger' : ''} font-mono-like`}>
                      {station.dateMaintenance || '—'}
                    </td>

                    {/* ACTIONS */}
                    <td className="actions-cell">
                      <div className="action-menu-wrapper">
                        <button
                          className="action-dots"
                          onClick={() => setOpenMenu(isMenuOpen ? null : station.id)}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div className={`action-dropdown animate-fade-in ${popUpward ? 'dropdown-up' : ''}`}>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setOpenMenu(null);
                                navigate(`/maintenance/${station.ws || ws}/form-pemeliharaan/${encodeURIComponent(station.id)}`);
                              }}
                            >
                              Form Pemeliharaan
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setOpenMenu(null);
                                navigate(`/maintenance/${station.ws || ws}/form-perbaikan/${encodeURIComponent(station.id)}`);
                              }}
                            >
                              Form Perbaikan
                            </button>
                            {station.reports?.length > 0 && (
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setOpenMenu(null);
                                  navigate(`/inventory/${station.ws || ws}/report/${encodeURIComponent(station.id)}/${station.reports[0].id}`);
                                }}
                              >
                                Lihat Laporan
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer / Pagination ── */}
      <div className="registry-footer">
        <span className="showing-text">
          Showing {stations.length === 0 ? 0 : indexOfFirst + 1} to{' '}
          {Math.min(indexOfLast, stations.length)} of {stations.length} entries
        </span>

        {totalPages > 0 && (
          <div className="pagination">
            <button
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {buildPages().map((p, idx) =>
              p === '...' ? (
                <span key={`dot-${idx}`} className="page-dots">…</span>
              ) : (
                <button
                  key={p}
                  className={`page-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => paginate(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationRegistryTable;
