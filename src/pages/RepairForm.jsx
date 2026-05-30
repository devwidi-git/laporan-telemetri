import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/useToast.js';
import { WS_LIST } from '../data/mockData';
import './RepairForm.css';

const RepairForm = () => {
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
    tanggal: '',
    gejalaKerusakan: '',
    bagianPerbaikan: '',
    petugasVerifikasi: '',
    tanggalVerifikasi: '',
    hasilVerifikasi: 'Normal',
    keterangan: '',
    dokumentasi: null,
    pembuatLaporan: user?.name || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      type: 'Repair',
      data: formData,
      date: new Date().toISOString(),
      status: 'Pending',
      signer: formData.pembuatLaporan || 'Unknown User',
      ws: ws
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });

      if (!response.ok) throw new Error('Failed to save report');

      showToast('Laporan Perbaikan Berhasil Disimpan!', 'success');
      navigate(-1);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStation) return <div style={{ padding: '2rem' }}>Loading data...</div>;
  if (!currentWs || !station) {
    return <div style={{ padding: '2rem' }}>Data tidak ditemukan</div>;
  }

  return (
    <div className="repair-form-page animate-fade-in">
      <div className="page-breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate(-1)}>
          BACK
        </span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">FORM PERBAIKAN</span>
      </div>

      <div className="form-container card">
        <div className="form-header">
          <button className="btn-back" type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2>Laporan Pekerjaan Perbaikan</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Peralatan Telemetri - {station.type}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="station-form">
          <div className="form-section-title">Informasi Stasiun</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nama Stasiun</label>
              <input type="text" value={station.name} readOnly className="read-only-input" />
            </div>
            <div className="form-group">
              <label>Jenis</label>
              <input type="text" value={station.type} readOnly className="read-only-input" />
            </div>
          </div>

          <div className="form-section-title mt-4">Detail Perbaikan</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Tanggal Perbaikan / Pemasangan <span className="required">*</span></label>
              <input 
                type="date" 
                name="tanggal" 
                value={formData.tanggal} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Bagian Peralatan yang Diperbaiki <span className="required">*</span></label>
              <input 
                type="text" 
                name="bagianPerbaikan" 
                value={formData.bagianPerbaikan} 
                onChange={handleChange} 
                placeholder="Contoh: Modul GSM, Baterai"
                required 
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Gejala Kerusakan <span className="required">*</span></label>
            <textarea 
              name="gejalaKerusakan" 
              value={formData.gejalaKerusakan} 
              onChange={handleChange} 
              placeholder="Jelaskan gejala kerusakan yang terjadi..."
              rows={3}
              required 
            ></textarea>
          </div>

          <div className="form-section-title mt-4">Verifikasi</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Petugas Verifikasi <span className="required">*</span></label>
              <input 
                type="text" 
                name="petugasVerifikasi" 
                value={formData.petugasVerifikasi} 
                onChange={handleChange} 
                placeholder="Nama Petugas"
                required 
              />
            </div>
            <div className="form-group">
              <label>Tanggal Verifikasi <span className="required">*</span></label>
              <input 
                type="date" 
                name="tanggalVerifikasi" 
                value={formData.tanggalVerifikasi} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Hasil Verifikasi <span className="required">*</span></label>
              <select name="hasilVerifikasi" value={formData.hasilVerifikasi} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Error">Error</option>
                <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Keterangan Tambahan</label>
            <textarea 
              name="keterangan" 
              value={formData.keterangan} 
              onChange={handleChange} 
              placeholder="Catatan tambahan (opsional)"
              rows={2}
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
            <label>Pembuat Laporan <span className="required">*</span></label>
            <input 
              type="text" 
              name="pembuatLaporan" 
              value={formData.pembuatLaporan} 
              onChange={handleChange} 
              required 
              style={{ maxWidth: '400px' }}
            />
          </div>

          <div className="form-actions mt-4">
            <button 
              type="button" 
              className="btn-outline" 
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Save size={16} style={{ marginRight: '8px' }} />
              {submitting ? 'Menyimpan...' : 'Simpan Laporan Perbaikan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairForm;
