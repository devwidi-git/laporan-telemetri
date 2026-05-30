import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Printer, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '../context/useToast.js';
import { WS_LIST } from '../data/mockData';
import './ReportViewer.css';

// Read-only Checkbox component for Maintenance report - defined outside component
const ROCheckbox = ({ label, checked }) => (
  <div className="ro-checkbox-item">
    <span>{label}</span>
    <div className={`ro-box ${checked ? 'checked' : ''}`}>
      {checked && '✓'}
    </div>
  </div>
);

const ReportViewer = () => {
  const { ws, stationId, reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext(); // Get logged-in user
  const { showToast } = useToast();

  const currentWs = WS_LIST.find(w => w.id === ws);

  const [station, setStation] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local state for approval flow
  const [reportStatus, setReportStatus] = useState('Pending');
  const [reportNote, setReportNote] = useState('');
  const [inputNote, setInputNote] = useState('');

  useEffect(() => {
    fetch(`/api/inventory/${ws}`)
      .then(res => res.json())
      .then(data => {
        const foundStation = data.stations.find(s => s.id === stationId);
        if (foundStation) {
          setStation(foundStation);
          const foundReport = foundStation.reports?.find(r => r.id === reportId);
          if (foundReport) {
            setReport(foundReport);
            setReportStatus(foundReport.status || 'Pending');
            setReportNote(foundReport.verifierNote || '');
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ws, stationId, reportId]);

  if (loading) {
    return <div className="report-viewer-page animate-fade-in"><div className="empty-state">Loading data...</div></div>;
  }

  if (!currentWs || !station || !report) {
    return (
      <div className="report-viewer-page animate-fade-in">
        <div className="empty-state">Data Laporan Tidak Ditemukan</div>
      </div>
    );
  }

  const { data, type, signer, timestamp } = report;
  const qrDataAdmin = `Telah disahkan secara digital oleh: ${signer}\nID Laporan: ${reportId}\nTanggal: ${new Date(timestamp).toLocaleString()}`;
  // Use dynamic verifier name from logged-in user or fallback to default
  const verifierName = user?.role === 'verifier' ? user.name : 'Sucipto Eko Pranoto';
  const qrDataVerifier = `Telah diverifikasi oleh: ${verifierName}\nStatus: APPROVED\nTanggal: ${new Date().toLocaleString()}`;

  const isVerifier = user?.role === 'verifier';
  const isPending = reportStatus === 'Pending';

  const handleVerifikasi = async (newStatus) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, verifierNote: inputNote })
      });

      if (!response.ok) throw new Error('Gagal menyimpan verifikasi');

      setReportStatus(newStatus);
      setReportNote(inputNote);

      if (newStatus === 'Approved') {
        showToast('Laporan Berhasil Disetujui!', 'success');
      } else {
        showToast('Laporan Ditolak / Dikembalikan!', 'error');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="report-viewer-page animate-fade-in">
      <div className="page-breadcrumb no-print">
        <span className="breadcrumb-link" onClick={() => navigate(-1)}>BACK</span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">REPORT VIEWER</span>
      </div>

      <div className="form-container report-document card">
        <div className="form-header no-print">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <h2>Laporan {type === 'Maintenance' ? 'Pemeliharaan' : 'Perbaikan'}</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{reportId}</p>
          </div>

          {reportStatus === 'Approved' && (
            <button className="btn-primary" onClick={() => window.print()} style={{ backgroundColor: '#166534' }}>
              <Printer size={16} style={{ marginRight: '8px' }} />
              Unduh PDF
            </button>
          )}
        </div>

        {/* STATUS BANNER */}
        {reportStatus !== 'Pending' && (
          <div className={`status-banner no-print ${reportStatus === 'Approved' ? 'banner-success' : 'banner-danger'}`}>
            <div className="banner-icon">
              {reportStatus === 'Approved' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div className="banner-content">
              <h3>{reportStatus === 'Approved' ? 'Report Approved' : 'Report Declined'}</h3>
              {reportNote && <p><strong>Verifier Note:</strong> {reportNote}</p>}
            </div>
          </div>
        )}

        {/* VERIFIER ACTION PANEL */}
        {isVerifier && isPending && (
          <div className="verifier-panel no-print">
            <div className="verifier-panel-header">
              <AlertCircle size={20} className="text-warning" />
              <h3>Verifier Action</h3>
            </div>
            <p>Please review the report below. You can approve or decline this report.</p>
            <div className="form-group mt-4">
              <label>Note for Operator (Optional)</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Example: Please attach a clearer photo..."
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
              ></textarea>
            </div>
            <div className="verifier-actions mt-4">
              <button className="btn-danger" onClick={() => handleVerifikasi('Declined')}>
                <XCircle size={18} style={{ marginRight: '6px' }} /> Decline Report
              </button>
              <button className="btn-success" onClick={() => handleVerifikasi('Approved')}>
                <CheckCircle size={18} style={{ marginRight: '6px' }} /> Approve Report
              </button>
            </div>
          </div>
        )}

        {/* DOCUMENT BODY */}
        <div className="document-body">
          <div className="doc-meta-right">
            <div>Lampiran 9, Dok No. QI/DTI/02</div>
            <div>Formulir No.QI/DTI/02-9, Status "R9"</div>
          </div>

          {/* KOP SURAT (HEADER DOKUMEN) */}
          <div className="doc-kop text-center">
            <h2 className="kop-title">
              {type === 'Maintenance' ? 'LAPORAN PEMELIHARAAN DAN KALIBRASI INTERNAL' : 'LAPORAN HASIL PERBAIKAN'}
            </h2>
            <h3 className="kop-subtitle">
              PERALATAN TELEMETRI *( {station.type} ) GSM
            </h3>
          </div>
          {type === 'Maintenance' ? (
          // ================== MAINTENANCE REPORT VIEW ==================
          <div className="maintenance-doc">
            <div className="doc-header-grid">
              <div className="doc-row"><span className="dl">Nama Stasiun Telemetri</span>: &nbsp;<span className="dv">{station.name}</span></div>
              <div className="doc-row"><span className="dl">Tanggal</span>: &nbsp;<span className="dv">{data.tanggal}</span></div>
              <div className="doc-row"><span className="dl">Periode Pemeliharaan</span>: &nbsp;<span className="dv">{data.periode}</span></div>
              <div className="doc-row"><span className="dl">Jam</span>: &nbsp;<span className="dv">BS: {data.jamBS} / AS: {data.jamAS}</span></div>
              <div className="doc-row"><span className="dl">Pelaksana</span>: &nbsp;<span className="dv">{data.pelaksana}</span></div>
              <div className="doc-row"><span className="dl">No. Alat Ukur</span>: &nbsp;<span className="dv">{data.noAlatUkur}</span></div>
              <div className="doc-row"><span className="dl">Cuaca</span>: &nbsp;<span className="dv">{data.cuaca}</span></div>
              <div className="doc-row"><span className="dl">No. GSM</span>: &nbsp;<span className="dv">{data.noGsm}</span></div>
            </div>

            <div className="doc-checklist-container">
              <div className="doc-col">
                <div className="doc-box-group">
                  <h5>a. Modem</h5>
                  <ROCheckbox label="Indikator Led" checked={data.cbModemLed} />
                  <ROCheckbox label="SIM Card Aktif" checked={data.cbModemSim} />
                </div>
                <div className="doc-box-group">
                  <h5>b. {station.type === 'WQMS' ? 'Data Logger' : '(Data Logger / Microcontroler)'}</h5>
                  <ROCheckbox label="Indikator Led" checked={data.cbLoggerLed} />
                  {station.type === 'WQMS' ? (
                    <ROCheckbox label="Pembersihan dan Pengecekan SONDE" checked={data.cbLoggerSonde} />
                  ) : (
                    <ROCheckbox label="Test SMS Manual dan Seting RTC" checked={data.cbLoggerSms} />
                  )}
                </div>
                <div className="doc-box-group">
                  <h5>c. AC-DC Converter</h5>
                  <ROCheckbox label="Pemeriksaan Kondisi Alat" checked={data.cbAcDcKondisi} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbAcDcSambungan} />
                </div>
                <div className="doc-box-group">
                  <h5>d. DC-DC Converter</h5>
                  <ROCheckbox label="Pemeriksaan Kondisi Alat" checked={data.cbDcDcKondisi} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbDcDcSambungan} />
                </div>

                {station.type === 'ARR' && (
                  <div className="doc-box-group">
                    <h5>e. Setting Tipping Bucket <span className="ro-box checked" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '10px' }}>{data.cbTippingBucket && '✓'}</span></h5>
                    <p className="doc-subtitle">Penunjukan Data Setting di Display (LCD)</p>
                    <table className="doc-table">
                      <thead>
                        <tr><th colSpan="2">Sebelum Kalibrasi</th><th colSpan="2">Sesudah Kalibrasi</th></tr>
                        <tr><th>Simulasi</th><th>Display</th><th>Simulasi</th><th>Display</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{data.arrSimBS}</td><td>{data.arrDispBS}</td>
                          <td>{data.arrSimAS}</td><td>{data.arrDispAS}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="doc-col">
                <div className="doc-box-group">
                  <h5>{station.type === 'WQMS' ? 'e.' : 'f.'} Smart Battery Charger</h5>
                  <ROCheckbox label="Pemeriksaan Kondisi Alat" checked={data.cbChargerKondisi} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbChargerSambungan} />
                </div>
                <div className="doc-box-group">
                  <h5>{station.type === 'WQMS' ? 'f.' : 'g.'} Antena GSM</h5>
                  <ROCheckbox label="Pemeriksaan Kondisi Alat" checked={data.cbAntenaKondisi} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbAntenaSambungan} />
                </div>
                <div className="doc-box-group">
                  <h5>{station.type === 'WQMS' ? 'g.' : 'h.'} Baterai / Aki</h5>
                  <ROCheckbox label="Pemeriksaan Level Air Aki" checked={data.cbBateraiAir} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbBateraiSambungan} />
                  <div className="doc-tegangan">Tegangan : {data.bateraiTegangan || '____'} Volt</div>
                </div>
                <div className="doc-box-group">
                  <h5>{station.type === 'WQMS' ? 'h.' : 'i.'} Sambungan PLN</h5>
                  <ROCheckbox label="Pemeriksaan Kondisi Alat" checked={data.cbPlnKondisi} />
                  <ROCheckbox label="Pemeriksaan Sambungan Kabel" checked={data.cbPlnSambungan} />
                </div>

                {station.type === 'AWLR' && (
                  <div className="doc-box-group">
                    <h5>j. Setting Sensor Water Level <span className="ro-box checked" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '10px' }}>{data.cbSensorWaterLevel && '✓'}</span></h5>
                    <p className="doc-subtitle">Penunjukan Data Setting di Display (LCD)</p>
                    <table className="doc-table">
                      <thead>
                        <tr><th colSpan="2">Sebelum Kalibrasi</th><th colSpan="2">Sesudah Kalibrasi</th></tr>
                        <tr><th>Aktual</th><th>Display</th><th>Aktual</th><th>Display</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{data.awlrAktualBS}</td><td>{data.awlrDispBS}</td>
                          <td>{data.awlrAktualAS}</td><td>{data.awlrDispAS}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          ) : (
          // ================== REPAIR REPORT VIEW ==================
          <div className="repair-doc">
            <table className="doc-table repair-doc-table">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>TANGGAL</th>
                  <th>STASIUN / JENIS</th>
                  <th>GEJALA KERUSAKAN</th>
                  <th>BAGIAN PERBAIKAN</th>
                  <th>VERIFIKASI (HASIL / PETUGAS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{data.tanggal}</td>
                  <td>{station.name}<br />({station.type})</td>
                  <td>{data.gejalaKerusakan}</td>
                  <td>{data.bagianPerbaikan}</td>
                  <td>
                    <div><strong>Hasil:</strong> {data.hasilVerifikasi}</div>
                    <div><strong>Petugas:</strong> {data.petugasVerifikasi}</div>
                    <div><strong>Tgl Verifikasi:</strong> {data.tanggalVerifikasi}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          )}

          <div className="doc-keterangan">
            <strong>Keterangan:</strong>
            <p>{data.keterangan || '-'}</p>
          </div>

          {data.dokumentasi && (
            <div className="doc-dokumentasi mt-4">
              <strong>Dokumentasi (Foto):</strong>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img src={data.dokumentasi} alt="Dokumentasi" style={{ maxWidth: '400px', border: '1px solid #000' }} />
              </div>
            </div>
          )}

          <div className="doc-signatures mt-6">
            <div className="sig-box">
              <p>Mengetahui,</p>
              <p>Ka. Tim Kalibrasi Divisi</p>
              <div className="sig-space qr-space">
                {reportStatus === 'Approved' ? (
                  <QRCodeSVG value={qrDataVerifier} size={80} level="M" fgColor="#166534" />
                ) : (
                  <span className="text-secondary" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Pending Verification</span>
                )}
              </div>
              <p className="sig-name"><strong>{verifierName}</strong></p>
            </div>
            <div className="sig-box text-right">
              <p>Dibuat oleh,</p>
              <p>Pelaksana Laporan</p>
              <div className="sig-space qr-space">
                <QRCodeSVG value={qrDataAdmin} size={80} level="M" />
              </div>
              <p className="sig-name"><strong>{signer}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
