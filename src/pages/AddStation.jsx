import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/useToast.js';
import { WS_LIST } from '../data/mockData';
import './AddStation.css';

const AddStation = () => {
  const { ws } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentWs = WS_LIST.find(w => w.id === ws);

  const [formData, setFormData] = useState({
    name: '',
    id: '',
    stationNumber: '',
    jenis: 'ARR',
    tipe: 'GSM',
    latitude: '',
    longitude: '',
    tipeTippingBucket: '0.2 mm',
    sensorAwlr: 'Pressure Transducer',
    merek: '',
    dataLogger: 'HMI',
    installDate: '',
    activeDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    const newStation = {
      id: formData.id,
      name: formData.name,
      type: formData.jenis,
      dateMaintenance: futureDate.toISOString().replace('T', ' ').substring(0, 19),
      ws: ws
    };

    try {
      const response = await fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStation)
      });

      if (!response.ok) throw new Error('Failed to add station');

      showToast('Stasiun Baru Berhasil Ditambahkan!', 'success');
      navigate(`/inventory/${ws}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!currentWs) return <div>WS not found</div>;

  return (
    <div className="add-station-page animate-fade-in">
      <div className="page-breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate(`/inventory/${ws}`)}>
          INVENTORY
        </span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="breadcrumb-link" onClick={() => navigate(`/inventory/${ws}`)}>
          {currentWs.name.toUpperCase()} RIVER BASIN
        </span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">ADD NEW STATION</span>
      </div>

      <div className="form-container card">
        <div className="form-header">
          <button className="btn-back" type="button" onClick={() => navigate(`/inventory/${ws}`)}>
            <ArrowLeft size={18} />
          </button>
          <h2>Add New Station - {currentWs.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="station-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nama Stasiun <span className="required">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Contoh: Bendungan Bili-Bili" 
                required 
              />
            </div>

            <div className="form-group">
              <label>ID Station <span className="required">*</span></label>
              <input 
                type="text" 
                name="id" 
                value={formData.id} 
                onChange={handleChange} 
                placeholder="Contoh: NODE-BR-999" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Nomor Stasiun</label>
              <input 
                type="text" 
                name="stationNumber" 
                value={formData.stationNumber} 
                onChange={handleChange} 
                placeholder="Nomor referensi stasiun" 
              />
            </div>

            <div className="form-group">
              <label>Jenis Stasiun</label>
              <select name="jenis" value={formData.jenis} onChange={handleChange}>
                <option value="ARR">ARR</option>
                <option value="AWLR">AWLR</option>
                <option value="WQMS">WQMS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tipe Komunikasi</label>
              <select name="tipe" value={formData.tipe} onChange={handleChange}>
                <option value="GSM">GSM</option>
                <option value="API">API</option>
              </select>
            </div>

            <div className="form-group location-group">
              <label>Lokasi Stasiun (Lat / Lng)</label>
              <div className="location-inputs">
                <input 
                  type="text" 
                  name="latitude" 
                  value={formData.latitude} 
                  onChange={handleChange} 
                  placeholder="Latitude" 
                />
                <input 
                  type="text" 
                  name="longitude" 
                  value={formData.longitude} 
                  onChange={handleChange} 
                  placeholder="Longitude" 
                />
              </div>
            </div>

            {formData.jenis === 'ARR' && (
              <div className="form-group animate-fade-in">
                <label>Tipe Tipping Bucket</label>
                <select name="tipeTippingBucket" value={formData.tipeTippingBucket} onChange={handleChange}>
                  <option value="0.2 mm">0.2 mm</option>
                  <option value="0.5 mm">0.5 mm</option>
                  <option value="1 mm">1 mm</option>
                </select>
              </div>
            )}

            {formData.jenis === 'AWLR' && (
              <div className="form-group animate-fade-in">
                <label>Sensor AWLR</label>
                <select name="sensorAwlr" value={formData.sensorAwlr} onChange={handleChange}>
                  <option value="Pressure Transducer">Pressure Transducer</option>
                  <option value="Ultrasonic">Ultrasonic</option>
                  <option value="Radar">Radar</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Merek Perangkat</label>
              <input 
                type="text" 
                name="merek" 
                value={formData.merek} 
                onChange={handleChange} 
                placeholder="Merek" 
              />
            </div>

            <div className="form-group">
              <label>Jenis Data Logger</label>
              <select name="dataLogger" value={formData.dataLogger} onChange={handleChange}>
                <option value="HMI">HMI</option>
                <option value="RTCU">RTCU</option>
                <option value="Android">Android</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tanggal Pemasangan</label>
              <input 
                type="date" 
                name="installDate" 
                value={formData.installDate} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Tanggal Mulai Aktif</label>
              <input 
                type="date" 
                name="activeDate" 
                value={formData.activeDate} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-outline" 
              onClick={() => navigate(`/inventory/${ws}`)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: '8px' }} />
              {loading ? 'Menyimpan...' : 'Simpan Stasiun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStation;
