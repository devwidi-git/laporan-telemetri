import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/useToast.js';
import { WS_LIST } from '../data/mockData';
import './MaintenanceForm.css';

const MaintenanceForm = () => {
  const { ws, stationId } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const { showToast } = useToast();

  const currentWs = WS_LIST.find(w => w.id === ws);
  const [station, setStation] = useState(null);
  const [loadingStation, setLoadingStation] = useState(true);

  useEffect(() => {
    fetch(`/api/inventory/${ws}`)
      .then(res => res.json())
      .then(data => {
        const found = data.stations.find(s => s.id === stationId);
        setStation(found);
      })
      .catch(console.error)
      .finally(() => setLoadingStation(false));
  }, [ws, stationId]);

  const [formData, setFormData] = useState({
    periode: '',
    pelaksana: user?.name || '',
    cuaca: '',
    tanggal: '',
    jamBS: '',
    jamAS: '',
    noAlatUkur: '',
    noGsm: '',
    keterangan: '',
    
    // Checkboxes
    cbModemLed: false,
    cbModemSim: false,
    cbLoggerLed: false,
    cbLoggerSms: false,
    cbLoggerSonde: false,
    cbAcDcKondisi: false,
    cbAcDcSambungan: false,
    cbDcDcKondisi: false,
    cbDcDcSambungan: false,
    cbTippingBucket: false,
    cbSensorWaterLevel: false,
    cbChargerKondisi: false,
    cbChargerSambungan: false,
    cbAntenaKondisi: false,
    cbAntenaSambungan: false,
    cbBateraiAir: false,
    cbBateraiSambungan: false,
    bateraiTegangan: '',
    cbPlnKondisi: false,
    cbPlnSambungan: false,

    // ARR Calibration Table
    arrSimBS: '',
    arrDispBS: '',
    arrSimAS: '',
    arrDispAS: '',

    // AWLR Calibration Table
    awlrAktualBS: '',
    awlrDispBS: '',
    awlrAktualAS: '',
    awlrDispAS: '',

    // Dokumentasi
    dokumentasi: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, dokumentasi: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const reportId = `REP-${Date.now()}`;
    const newReport = {
      id: reportId,
      stationId: stationId,
      type: 'Maintenance',
      data: formData,
      date: new Date().toISOString(),
      status: 'Pending',
      signer: formData.pelaksana || 'Unknown User',
      ws: ws
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });

      if (!response.ok) throw new Error('Failed to save report');

      showToast('Laporan Pemeliharaan Berhasil Disimpan!', 'success');
      navigate(-1);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStation) return <div style={{ padding: '2rem' }}>Loading data...</div>;
  if (!currentWs || !station) return <div style={{ padding: '2rem' }}>Data tidak ditemukan</div>;

  return (
    <div className="maintenance-form-page animate-fade-in">
      <div className="page-breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate(-1)}>BACK</span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">FORM PEMELIHARAAN</span>
      </div>

      <div className="form-container card">
        <div className="form-header">
          <button className="btn-back" type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2>Laporan Pemeliharaan & Kalibrasi Internal</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Peralatan Telemetri - {station.type} GSM
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="station-form">
          {/* BAGIAN 1: HEADER INFORMASI */}
          <div className="form-grid header-grid">
            <div className="form-group">
              <label>Nama Stasiun Telemetri</label>
              <input type="text" value={station.name} readOnly className="read-only-input" />
            </div>
            <div className="form-group">
              <label>Tanggal</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Periode Pemeliharaan</label>
              <input type="text" name="periode" value={formData.periode} onChange={handleChange} required />
            </div>
            <div className="form-group time-group">
              <label>Jam</label>
              <div className="time-inputs">
                <div>
                  <span className="time-label">BS:</span>
                  <input type="time" name="jamBS" value={formData.jamBS} onChange={handleChange} required />
                </div>
                <div>
                  <span className="time-label">AS:</span>
                  <input type="time" name="jamAS" value={formData.jamAS} onChange={handleChange} required />
                </div>
              </div>
            </div>


            <div className="form-group">
              <label>No. Alat Ukur</label>
              <input type="text" name="noAlatUkur" value={formData.noAlatUkur} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cuaca</label>
              <input type="text" name="cuaca" value={formData.cuaca} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>No. GSM</label>
              <input type="text" name="noGsm" value={formData.noGsm} onChange={handleChange} />
            </div>
          </div>

          <div className="checklist-container">
            {/* COLUMN LEFT */}
            <div className="checklist-col">
              <div className="check-box-group">
                <h4>a. Modem</h4>
                <label className="checkbox-item">
                  <span>Indikator Led</span>
                  <input type="checkbox" name="cbModemLed" checked={formData.cbModemLed} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>SIM Card Aktif</span>
                  <input type="checkbox" name="cbModemSim" checked={formData.cbModemSim} onChange={handleChange} />
                </label>
              </div>

              <div className="check-box-group">
                <h4>b. {station.type === 'WQMS' ? 'Data Logger' : '(Data Logger / Microcontroler)'}</h4>
                <label className="checkbox-item">
                  <span>Indikator Led</span>
                  <input type="checkbox" name="cbLoggerLed" checked={formData.cbLoggerLed} onChange={handleChange} />
                </label>
                {station.type === 'WQMS' ? (
                  <label className="checkbox-item">
                    <span>Pembersihan dan Pengecekan SONDE</span>
                    <input type="checkbox" name="cbLoggerSonde" checked={formData.cbLoggerSonde} onChange={handleChange} />
                  </label>
                ) : (
                  <label className="checkbox-item">
                    <span>Test SMS Manual dan Seting RTC</span>
                    <input type="checkbox" name="cbLoggerSms" checked={formData.cbLoggerSms} onChange={handleChange} />
                  </label>
                )}
              </div>

              <div className="check-box-group">
                <h4>c. AC-DC Converter</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Kondisi Alat</span>
                  <input type="checkbox" name="cbAcDcKondisi" checked={formData.cbAcDcKondisi} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbAcDcSambungan" checked={formData.cbAcDcSambungan} onChange={handleChange} />
                </label>
              </div>

              <div className="check-box-group">
                <h4>d. DC-DC Converter</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Kondisi Alat</span>
                  <input type="checkbox" name="cbDcDcKondisi" checked={formData.cbDcDcKondisi} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbDcDcSambungan" checked={formData.cbDcDcSambungan} onChange={handleChange} />
                </label>
              </div>

              {/* CALIBRATION ARR */}
              {station.type === 'ARR' && (
                <div className="check-box-group">
                  <div className="calib-header">
                    <h4>e. Setting Tipping Bucket</h4>
                    <input type="checkbox" name="cbTippingBucket" checked={formData.cbTippingBucket} onChange={handleChange} />
                  </div>
                  <p className="calib-subtitle">Penunjukan Data Setting di Display (LCD)</p>
                  <table className="calib-table">
                    <thead>
                      <tr>
                        <th colSpan="2">Sebelum Kalibrasi</th>
                        <th colSpan="2">Sesudah Kalibrasi</th>
                      </tr>
                      <tr>
                        <th>Simulasi</th>
                        <th>Display</th>
                        <th>Simulasi</th>
                        <th>Display</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><input type="text" name="arrSimBS" value={formData.arrSimBS} onChange={handleChange} /></td>
                        <td><input type="text" name="arrDispBS" value={formData.arrDispBS} onChange={handleChange} /></td>
                        <td><input type="text" name="arrSimAS" value={formData.arrSimAS} onChange={handleChange} /></td>
                        <td><input type="text" name="arrDispAS" value={formData.arrDispAS} onChange={handleChange} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* COLUMN RIGHT */}
            <div className="checklist-col">
              <div className="check-box-group">
                <h4>{station.type === 'WQMS' ? 'e.' : 'f.'} Smart Battery Charger</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Kondisi Alat</span>
                  <input type="checkbox" name="cbChargerKondisi" checked={formData.cbChargerKondisi} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbChargerSambungan" checked={formData.cbChargerSambungan} onChange={handleChange} />
                </label>
              </div>

              <div className="check-box-group">
                <h4>{station.type === 'WQMS' ? 'f.' : 'g.'} Antena GSM</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Kondisi Alat</span>
                  <input type="checkbox" name="cbAntenaKondisi" checked={formData.cbAntenaKondisi} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbAntenaSambungan" checked={formData.cbAntenaSambungan} onChange={handleChange} />
                </label>
              </div>

              <div className="check-box-group">
                <h4>{station.type === 'WQMS' ? 'g.' : 'h.'} Baterai / Aki</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Level Air Aki</span>
                  <input type="checkbox" name="cbBateraiAir" checked={formData.cbBateraiAir} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbBateraiSambungan" checked={formData.cbBateraiSambungan} onChange={handleChange} />
                </label>
                <div className="tegangan-input">
                  <span>Tegangan : </span>
                  <input type="number" step="0.1" name="bateraiTegangan" value={formData.bateraiTegangan} onChange={handleChange} />
                  <span> Volt</span>
                </div>
              </div>

              <div className="check-box-group">
                <h4>{station.type === 'WQMS' ? 'h.' : 'i.'} Sambungan PLN</h4>
                <label className="checkbox-item">
                  <span>Pemeriksaan Kondisi Alat</span>
                  <input type="checkbox" name="cbPlnKondisi" checked={formData.cbPlnKondisi} onChange={handleChange} />
                </label>
                <label className="checkbox-item">
                  <span>Pemeriksaan Sambungan Kabel</span>
                  <input type="checkbox" name="cbPlnSambungan" checked={formData.cbPlnSambungan} onChange={handleChange} />
                </label>
              </div>

              {/* CALIBRATION AWLR */}
              {station.type === 'AWLR' && (
                <div className="check-box-group">
                  <div className="calib-header">
                    <h4>j. Setting Sensor Water Level</h4>
                    <input type="checkbox" name="cbSensorWaterLevel" checked={formData.cbSensorWaterLevel} onChange={handleChange} />
                  </div>
                  <p className="calib-subtitle">Penunjukan Data Setting di Display (LCD)</p>
                  <table className="calib-table">
                    <thead>
                      <tr>
                        <th colSpan="2">Sebelum Kalibrasi</th>
                        <th colSpan="2">Sesudah Kalibrasi</th>
                      </tr>
                      <tr>
                        <th>Aktual</th>
                        <th>Display</th>
                        <th>Aktual</th>
                        <th>Display</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><input type="text" name="awlrAktualBS" value={formData.awlrAktualBS} onChange={handleChange} /></td>
                        <td><input type="text" name="awlrDispBS" value={formData.awlrDispBS} onChange={handleChange} /></td>
                        <td><input type="text" name="awlrAktualAS" value={formData.awlrAktualAS} onChange={handleChange} /></td>
                        <td><input type="text" name="awlrDispAS" value={formData.awlrDispAS} onChange={handleChange} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="form-group full-width mt-4">
            <label>Keterangan :</label>
            <textarea 
              name="keterangan" 
              value={formData.keterangan} 
              onChange={handleChange} 
              rows={4}
            ></textarea>
          </div>

          <div className="form-group full-width mt-4">
            <label>Dokumentasi (Foto) :</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file-input"
            />
            {formData.dokumentasi && (
              <div className="image-preview mt-2">
                <img src={formData.dokumentasi} alt="Dokumentasi Preview" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
            )}
          </div>

          <div className="form-group full-width mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <label>Pembuat Laporan / Pelaksana Kalibrasi <span className="required">*</span></label>
            <input 
              type="text" 
              name="pelaksana" 
              value={formData.pelaksana} 
              onChange={handleChange} 
              required 
              style={{ maxWidth: '400px' }}
            />
          </div>

          <div className="form-actions mt-4">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Save size={16} style={{ marginRight: '8px' }} />
              {submitting ? 'Menyimpan...' : 'Simpan Laporan Kalibrasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
