import express from 'express';
import db from './db.js';

const app = express();
// Increase limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = 3001;

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Get Inventory (Stations + Summary)
app.get('/api/inventory/:ws', (req, res) => {
  const ws = req.params.ws;
  
  let stations;
  if (ws === 'all') {
    stations = db.prepare('SELECT * FROM stations').all();
  } else {
    stations = db.prepare('SELECT * FROM stations WHERE ws = ?').all(ws);
  }

  // Inject reports into stations array
  const maintStmt = db.prepare('SELECT * FROM maintenance_reports WHERE stationId = ?');
  const repairStmt = db.prepare('SELECT * FROM repair_reports WHERE stationId = ?');
  
  stations.forEach(st => {
    const mReports = maintStmt.all(st.id).map(r => {
      // Reconstruct the data object
      const data = {
        periode: r.periode, pelaksana: r.pelaksana, cuaca: r.cuaca, tanggal: r.tanggal, jamBS: r.jamBS, jamAS: r.jamAS,
        noAlatUkur: r.noAlatUkur, noGsm: r.noGsm, keterangan: r.keterangan,
        cbModemLed: r.cbModemLed === 1, cbModemSim: r.cbModemSim === 1, cbLoggerLed: r.cbLoggerLed === 1, cbLoggerSms: r.cbLoggerSms === 1, cbLoggerSonde: r.cbLoggerSonde === 1,
        cbAcDcKondisi: r.cbAcDcKondisi === 1, cbAcDcSambungan: r.cbAcDcSambungan === 1, cbDcDcKondisi: r.cbDcDcKondisi === 1, cbDcDcSambungan: r.cbDcDcSambungan === 1,
        cbTippingBucket: r.cbTippingBucket === 1, cbSensorWaterLevel: r.cbSensorWaterLevel === 1, cbChargerKondisi: r.cbChargerKondisi === 1, cbChargerSambungan: r.cbChargerSambungan === 1,
        cbAntenaKondisi: r.cbAntenaKondisi === 1, cbAntenaSambungan: r.cbAntenaSambungan === 1, cbBateraiAir: r.cbBateraiAir === 1, cbBateraiSambungan: r.cbBateraiSambungan === 1, bateraiTegangan: r.bateraiTegangan,
        cbPlnKondisi: r.cbPlnKondisi === 1, cbPlnSambungan: r.cbPlnSambungan === 1,
        arrSimBS: r.arrSimBS, arrDispBS: r.arrDispBS, arrSimAS: r.arrSimAS, arrDispAS: r.arrDispAS,
        awlrAktualBS: r.awlrAktualBS, awlrDispBS: r.awlrDispBS, awlrAktualAS: r.awlrAktualAS, awlrDispAS: r.awlrDispAS,
        wqmsAktualBS: r.wqmsAktualBS, wqmsDispBS: r.wqmsDispBS, wqmsAktualAS: r.wqmsAktualAS, wqmsDispAS: r.wqmsDispAS,
        dokumentasi: r.dokumentasi
      };
      return { id: r.id, stationId: r.stationId, type: 'Maintenance', timestamp: r.date, status: r.status, signer: r.signer, verifierNote: r.verifierNote, ws: r.ws, data };
    });

    const rReports = repairStmt.all(st.id).map(r => {
      const data = {
        tanggal: r.tanggal, gejalaKerusakan: r.gejalaKerusakan, bagianPerbaikan: r.bagianPerbaikan,
        petugasVerifikasi: r.petugasVerifikasi, tanggalVerifikasi: r.tanggalVerifikasi, hasilVerifikasi: r.hasilVerifikasi,
        keterangan: r.keterangan, dokumentasi: r.dokumentasi, pembuatLaporan: r.pembuatLaporan
      };
      return { id: r.id, stationId: r.stationId, type: 'Repair', timestamp: r.date, status: r.status, signer: r.signer, verifierNote: r.verifierNote, ws: r.ws, data };
    });

    st.reports = [...mReports, ...rReports];
  });

  res.json({ stations });
});

// Add new station
app.post('/api/stations', (req, res) => {
  const { id, name, type, dateMaintenance, ws } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO stations (id, name, type, dateMaintenance, ws) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, name, type, dateMaintenance, ws);
    res.json({ success: true, message: 'Station added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a report
app.post('/api/reports', (req, res) => {
  const { id, stationId, type, date, status, signer, verifierNote, data, ws } = req.body;
  try {
    if (type === 'Maintenance') {
      const stmt = db.prepare(`
        INSERT INTO maintenance_reports (
          id, stationId, date, status, signer, verifierNote, ws,
          periode, pelaksana, cuaca, tanggal, jamBS, jamAS, noAlatUkur, noGsm, keterangan,
          cbModemLed, cbModemSim, cbLoggerLed, cbLoggerSms, cbLoggerSonde,
          cbAcDcKondisi, cbAcDcSambungan, cbDcDcKondisi, cbDcDcSambungan,
          cbTippingBucket, cbSensorWaterLevel, cbChargerKondisi, cbChargerSambungan,
          cbAntenaKondisi, cbAntenaSambungan, cbBateraiAir, cbBateraiSambungan, bateraiTegangan,
          cbPlnKondisi, cbPlnSambungan,
          arrSimBS, arrDispBS, arrSimAS, arrDispAS,
          awlrAktualBS, awlrDispBS, awlrAktualAS, awlrDispAS,
          wqmsAktualBS, wqmsDispBS, wqmsAktualAS, wqmsDispAS,
          dokumentasi
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?
        )
      `);
      stmt.run(
        id, stationId, date, status, signer, verifierNote || '', ws,
        data.periode || '', data.pelaksana || '', data.cuaca || '', data.tanggal || '', data.jamBS || '', data.jamAS || '', data.noAlatUkur || '', data.noGsm || '', data.keterangan || '',
        data.cbModemLed ? 1 : 0, data.cbModemSim ? 1 : 0, data.cbLoggerLed ? 1 : 0, data.cbLoggerSms ? 1 : 0, data.cbLoggerSonde ? 1 : 0,
        data.cbAcDcKondisi ? 1 : 0, data.cbAcDcSambungan ? 1 : 0, data.cbDcDcKondisi ? 1 : 0, data.cbDcDcSambungan ? 1 : 0,
        data.cbTippingBucket ? 1 : 0, data.cbSensorWaterLevel ? 1 : 0, data.cbChargerKondisi ? 1 : 0, data.cbChargerSambungan ? 1 : 0,
        data.cbAntenaKondisi ? 1 : 0, data.cbAntenaSambungan ? 1 : 0, data.cbBateraiAir ? 1 : 0, data.cbBateraiSambungan ? 1 : 0, data.bateraiTegangan || '',
        data.cbPlnKondisi ? 1 : 0, data.cbPlnSambungan ? 1 : 0,
        data.arrSimBS || '', data.arrDispBS || '', data.arrSimAS || '', data.arrDispAS || '',
        data.awlrAktualBS || '', data.awlrDispBS || '', data.awlrAktualAS || '', data.awlrDispAS || '',
        data.wqmsAktualBS || '', data.wqmsDispBS || '', data.wqmsAktualAS || '', data.wqmsDispAS || '',
        data.dokumentasi || ''
      );
    } else if (type === 'Repair') {
      const stmt = db.prepare(`
        INSERT INTO repair_reports (
          id, stationId, date, status, signer, verifierNote, ws,
          tanggal, gejalaKerusakan, bagianPerbaikan, petugasVerifikasi, tanggalVerifikasi, hasilVerifikasi, keterangan, dokumentasi, pembuatLaporan
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);
      stmt.run(
        id, stationId, date, status, signer, verifierNote || '', ws,
        data.tanggal || '', data.gejalaKerusakan || '', data.bagianPerbaikan || '', data.petugasVerifikasi || '', data.tanggalVerifikasi || '', data.hasilVerifikasi || '', data.keterangan || '', data.dokumentasi || '', data.pembuatLaporan || ''
      );
    }
    
    // Update station's dateMaintenance to 6 months from now (next maintenance schedule)
    const nextMaintenanceDate = new Date();
    nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 6);
    const formattedDate = nextMaintenanceDate.toISOString().replace('T', ' ').substring(0, 19);
    
    const updateStmt = db.prepare('UPDATE stations SET dateMaintenance = ? WHERE id = ?');
    updateStmt.run(formattedDate, stationId);
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update report status (Verification)
app.put('/api/reports/:id/verify', (req, res) => {
  const reportId = req.params.id;
  const { status, verifierNote } = req.body;
  try {
    // Try updating maintenance
    let stmt = db.prepare('UPDATE maintenance_reports SET status = ?, verifierNote = ? WHERE id = ?');
    let info = stmt.run(status, verifierNote, reportId);
    
    // If not found in maintenance, try repair
    if (info.changes === 0) {
      stmt = db.prepare('UPDATE repair_reports SET status = ?, verifierNote = ? WHERE id = ?');
      info = stmt.run(status, verifierNote, reportId);
    }
    
    if (info.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
