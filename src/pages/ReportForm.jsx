import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ReportForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Laporan berhasil disimpan (Mock)');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Buat Laporan Baru</h1>
        <p className="text-secondary">Isi form di bawah untuk melaporkan pemeliharaan perangkat telemetri.</p>
      </div>

      <Card style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input label="ID Perangkat" id="deviceId" placeholder="Misal: TM-001" required />
            <Input label="Tanggal Pemeliharaan" id="date" type="date" required />
          </div>
          
          <Input label="Lokasi / Stasiun" id="location" placeholder="Nama stasiun telemetri" required />
          
          <div className="input-group">
            <label className="input-label" htmlFor="issue">Deskripsi Masalah</label>
            <textarea 
              id="issue" 
              className="input-field" 
              rows="4" 
              placeholder="Jelaskan masalah yang terjadi..."
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="action">Tindakan yang Dilakukan</label>
            <textarea 
              id="action" 
              className="input-field" 
              rows="4" 
              placeholder="Jelaskan tindakan pemeliharaan yang telah dilakukan..."
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Button type="button" variant="secondary">Batal</Button>
            <Button type="submit" variant="primary">Simpan Laporan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportForm;