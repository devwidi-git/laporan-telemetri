import { ACCOUNTS, DASHBOARD_DATA } from '../src/data/mockData.js';
import db from './db.js';

console.log('Seeding Database...');

// Seed users
const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, username, password, name, role, ws) VALUES (?, ?, ?, ?, ?, ?)');
ACCOUNTS.forEach(acc => {
  insertUser.run(acc.id, acc.username, acc.password, acc.name, acc.role || 'operator', acc.ws);
});

// Seed stations
const insertStation = db.prepare('INSERT OR IGNORE INTO stations (id, name, type, dateMaintenance, ws) VALUES (?, ?, ?, ?, ?)');

// Seed Maintenance Reports
const insertMaintenance = db.prepare(`
  INSERT OR IGNORE INTO maintenance_reports (
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

// Seed Repair Reports
const insertRepair = db.prepare(`
  INSERT OR IGNORE INTO repair_reports (
    id, stationId, date, status, signer, verifierNote, ws,
    tanggal, gejalaKerusakan, bagianPerbaikan, petugasVerifikasi, tanggalVerifikasi, hasilVerifikasi, keterangan, dokumentasi, pembuatLaporan
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
`);

Object.entries(DASHBOARD_DATA).forEach(([ws, data]) => {
  data.stations.forEach(station => {
    insertStation.run(station.id, station.name, station.type, station.dateMaintenance, ws);
    
    if (station.reports && station.reports.length > 0) {
      station.reports.forEach(report => {
        const rData = report.data || {};
        
        if (report.type === 'Maintenance') {
          insertMaintenance.run(
            report.id, station.id, report.timestamp, report.status, report.signer, report.verifierNote || '', ws,
            rData.periode || '', rData.pelaksana || '', rData.cuaca || '', rData.tanggal || '', rData.jamBS || '', rData.jamAS || '', rData.noAlatUkur || '', rData.noGsm || '', rData.keterangan || '',
            rData.cbModemLed ? 1 : 0, rData.cbModemSim ? 1 : 0, rData.cbLoggerLed ? 1 : 0, rData.cbLoggerSms ? 1 : 0, rData.cbLoggerSonde ? 1 : 0,
            rData.cbAcDcKondisi ? 1 : 0, rData.cbAcDcSambungan ? 1 : 0, rData.cbDcDcKondisi ? 1 : 0, rData.cbDcDcSambungan ? 1 : 0,
            rData.cbTippingBucket ? 1 : 0, rData.cbSensorWaterLevel ? 1 : 0, rData.cbChargerKondisi ? 1 : 0, rData.cbChargerSambungan ? 1 : 0,
            rData.cbAntenaKondisi ? 1 : 0, rData.cbAntenaSambungan ? 1 : 0, rData.cbBateraiAir ? 1 : 0, rData.cbBateraiSambungan ? 1 : 0, rData.bateraiTegangan || '',
            rData.cbPlnKondisi ? 1 : 0, rData.cbPlnSambungan ? 1 : 0,
            rData.arrSimBS || '', rData.arrDispBS || '', rData.arrSimAS || '', rData.arrDispAS || '',
            rData.awlrAktualBS || '', rData.awlrDispBS || '', rData.awlrAktualAS || '', rData.awlrDispAS || '',
            rData.wqmsAktualBS || '', rData.wqmsDispBS || '', rData.wqmsAktualAS || '', rData.wqmsDispAS || '',
            rData.dokumentasi || ''
          );
        } else if (report.type === 'Repair') {
          insertRepair.run(
            report.id, station.id, report.timestamp, report.status, report.signer, report.verifierNote || '', ws,
            rData.tanggal || '', rData.gejalaKerusakan || '', rData.bagianPerbaikan || '', rData.petugasVerifikasi || '', rData.tanggalVerifikasi || '', rData.hasilVerifikasi || '', rData.keterangan || '', rData.dokumentasi || '', rData.pembuatLaporan || ''
          );
        }
      });
    }
  });
});

console.log('Database Seeding Complete!');
