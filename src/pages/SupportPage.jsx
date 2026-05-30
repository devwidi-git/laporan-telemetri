import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, Download, Upload, FileText } from 'lucide-react';
import { useToast } from '../context/useToast.js';
import './SupportPage.css';

// Mock list of initial manual books
const INITIAL_BOOKS = [
  { id: 1, title: 'Panduan Pengisian Form Pemeliharaan (ARR/AWLR)', version: 'v1.2', date: '2023-09-15', size: '2.4 MB' },
  { id: 2, title: 'Manual Book Kalibrasi Sensor WQMS', version: 'v2.0', date: '2023-10-02', size: '5.1 MB' },
  { id: 3, title: 'SOP Troubleshooting Stasiun Offline', version: 'v1.0', date: '2023-10-20', size: '1.8 MB' },
];

const SupportPage = () => {
  const { user } = useOutletContext();
  const isSuperAdmin = user?.role === 'super-admin';
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const { showToast } = useToast();

  const handleMockUpload = () => {
    // Simulate an upload process
    const newBook = {
      id: Date.now(),
      title: 'Dokumen Panduan Terbaru (Mock Upload)',
      version: 'v1.0',
      date: new Date().toISOString().split('T')[0],
      size: '3.0 MB'
    };
    
    setBooks([newBook, ...books]);
    showToast('Dokumen berhasil diunggah dan tersedia untuk semua admin wilayah!', 'success');
  };

  return (
    <div className="support-page animate-fade-in">
      <div className="support-header">
        <div className="support-title-container">
          <BookOpen size={32} className="support-icon-main" />
          <div>
            <h1 className="page-title">Pusat Bantuan & Panduan</h1>
            <p className="page-subtitle">
              Unduh buku panduan resmi (Manual Book) untuk proses kalibrasi dan pengisian laporan.
            </p>
          </div>
        </div>
        
        {isSuperAdmin && (
          <button className="btn-primary upload-btn" onClick={handleMockUpload}>
            <Upload size={18} style={{ marginRight: '8px' }} /> Upload Panduan Baru
          </button>
        )}
      </div>



      <div className="manual-books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card card">
            <div className="book-icon-wrapper">
              <FileText size={48} className="book-icon" />
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <div className="book-meta">
                <span>Versi: {book.version}</span>
                <span className="bullet">&bull;</span>
                <span>Diperbarui: {book.date}</span>
                <span className="bullet">&bull;</span>
                <span>{book.size}</span>
              </div>
            </div>
            <div className="book-actions">
              <button 
                className="btn-outline download-btn"
                onClick={() => showToast(`Mengunduh: ${book.title}...`, 'success')}
              >
                <Download size={16} style={{ marginRight: '6px' }} /> View / Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPage;
