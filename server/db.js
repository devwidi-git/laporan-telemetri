import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

db.pragma('foreign_keys = ON');

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      ws TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      dateMaintenance TEXT,
      ws TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS maintenance_reports (
      id TEXT PRIMARY KEY,
      stationId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      signer TEXT NOT NULL,
      verifierNote TEXT,
      ws TEXT NOT NULL,

      -- Form fields
      periode TEXT,
      pelaksana TEXT,
      cuaca TEXT,
      tanggal TEXT,
      jamBS TEXT,
      jamAS TEXT,
      noAlatUkur TEXT,
      noGsm TEXT,
      keterangan TEXT,
      
      -- Checkboxes
      cbModemLed INTEGER,
      cbModemSim INTEGER,
      cbLoggerLed INTEGER,
      cbLoggerSms INTEGER,
      cbLoggerSonde INTEGER,
      cbAcDcKondisi INTEGER,
      cbAcDcSambungan INTEGER,
      cbDcDcKondisi INTEGER,
      cbDcDcSambungan INTEGER,
      cbTippingBucket INTEGER,
      cbSensorWaterLevel INTEGER,
      cbChargerKondisi INTEGER,
      cbChargerSambungan INTEGER,
      cbAntenaKondisi INTEGER,
      cbAntenaSambungan INTEGER,
      cbBateraiAir INTEGER,
      cbBateraiSambungan INTEGER,
      bateraiTegangan TEXT,
      cbPlnKondisi INTEGER,
      cbPlnSambungan INTEGER,

      -- ARR Calibration
      arrSimBS TEXT,
      arrDispBS TEXT,
      arrSimAS TEXT,
      arrDispAS TEXT,

      -- AWLR Calibration
      awlrAktualBS TEXT,
      awlrDispBS TEXT,
      awlrAktualAS TEXT,
      awlrDispAS TEXT,

      -- WQMS Calibration
      wqmsAktualBS TEXT,
      wqmsDispBS TEXT,
      wqmsAktualAS TEXT,
      wqmsDispAS TEXT,

      dokumentasi TEXT,
      
      FOREIGN KEY (stationId) REFERENCES stations(id)
    );

    CREATE TABLE IF NOT EXISTS repair_reports (
      id TEXT PRIMARY KEY,
      stationId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      signer TEXT NOT NULL,
      verifierNote TEXT,
      ws TEXT NOT NULL,

      -- Form fields
      tanggal TEXT,
      gejalaKerusakan TEXT,
      bagianPerbaikan TEXT,
      petugasVerifikasi TEXT,
      tanggalVerifikasi TEXT,
      hasilVerifikasi TEXT,
      keterangan TEXT,
      dokumentasi TEXT,
      pembuatLaporan TEXT,

      FOREIGN KEY (stationId) REFERENCES stations(id)
    );
  `);
};

initDB();

export default db;
