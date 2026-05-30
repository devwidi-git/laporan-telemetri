// --- ACCOUNTS (3 per WS) ---
export const ACCOUNTS = [
  // Super Admin
  { id: 'usr-sa-1', username: 'superadmin', password: 'password123', ws: 'all', name: 'Super Administrator', role: 'super-admin' },
  
  // Verifikator (Ka Tim Kalibrasi)
  { id: 'usr-vf-1', username: 'verifikator', password: 'password123', ws: 'all', name: 'Sucipto Eko Pranoto', role: 'verifier' },
  
  // Brantas
  { id: 'usr-br-1', username: 'admin_brantas', password: 'password123', ws: 'brantas', name: 'Brantas Admin 1' },
  { id: 'usr-br-2', username: 'op_brantas1', password: 'password123', ws: 'brantas', name: 'Brantas Operator 1' },
  { id: 'usr-br-3', username: 'op_brantas2', password: 'password123', ws: 'brantas', name: 'Brantas Operator 2' },
  
  // Bengawan Solo
  { id: 'usr-bs-1', username: 'admin_bs', password: 'password123', ws: 'bengawan-solo', name: 'Bengawan Solo Admin' },
  { id: 'usr-bs-2', username: 'op_bs1', password: 'password123', ws: 'bengawan-solo', name: 'BS Operator 1' },
  { id: 'usr-bs-3', username: 'op_bs2', password: 'password123', ws: 'bengawan-solo', name: 'BS Operator 2' },
  
  // Jratun Seluna
  { id: 'usr-js-1', username: 'admin_js', password: 'password123', ws: 'jratun-seluna', name: 'Jratun Seluna Admin' },
  { id: 'usr-js-2', username: 'op_js1', password: 'password123', ws: 'jratun-seluna', name: 'JS Operator 1' },
  { id: 'usr-js-3', username: 'op_js2', password: 'password123', ws: 'jratun-seluna', name: 'JS Operator 2' },
  
  // Serayu Bogowonto
  { id: 'usr-sb-1', username: 'admin_sb', password: 'password123', ws: 'serayu-bogowonto', name: 'Serayu Bogowonto Admin' },
  { id: 'usr-sb-2', username: 'op_sb1', password: 'password123', ws: 'serayu-bogowonto', name: 'SB Operator 1' },
  { id: 'usr-sb-3', username: 'op_sb2', password: 'password123', ws: 'serayu-bogowonto', name: 'SB Operator 2' },
  
  // Toba Asahan
  { id: 'usr-ta-1', username: 'admin_ta', password: 'password123', ws: 'toba-asahan', name: 'Toba Asahan Admin' },
  { id: 'usr-ta-2', username: 'op_ta1', password: 'password123', ws: 'toba-asahan', name: 'TA Operator 1' },
  { id: 'usr-ta-3', username: 'op_ta2', password: 'password123', ws: 'toba-asahan', name: 'TA Operator 2' }
];

export const WS_LIST = [
  { id: 'brantas', name: 'Brantas' },
  { id: 'bengawan-solo', name: 'Bengawan Solo' },
  { id: 'jratun-seluna', name: 'Jratun Seluna' },
  { id: 'serayu-bogowonto', name: 'Serayu Bogowonto' },
  { id: 'toba-asahan', name: 'Toba Asahan' }
];

// --- MOCK DATA PER WS ---
export const DASHBOARD_DATA = {
  'brantas': {
    summary: { totalStations: 124, activeNodes: 118, systemHealth: 95.1, offlineCount: 2, maintCount: 4 },
    stations: [
      { id: 'NODE-BR-001', name: 'Karangkates Dam Upper', type: 'AWLR', status: 'Active', dateMaintenance: '2026-06-15 14:00:00', reports: [{ id: 'REP-ARR-003', type: 'Maintenance', timestamp: '2023-11-02T09:15:00Z', signer: 'Admin Brantas', status: 'Pending', data: { tanggal: '02-11-2023', periode: 'Nov 2023', jamBS: '09:00', jamAS: '09:30', pelaksana: 'Tim Brantas', noAlatUkur: 'AV-092', cuaca: 'Cerah', noGsm: '08123456780', keterangan: 'Semua normal.' } }] },
      { id: 'NODE-BR-042', name: 'Lahor Tributary', type: 'ARR', status: 'Active', dateMaintenance: '2026-06-20 10:00:00' },
      { id: 'NODE-BR-088', name: 'Wlingi Reservoir Intake', type: 'WQMS', status: 'Offline', dateMaintenance: '2026-05-10 08:00:00' },
      { id: 'NODE-BR-112', name: 'Selorejo Dam Spillway', type: 'AWLR', status: 'Maint.', dateMaintenance: '2026-06-05 10:00:00' },
      { id: 'NODE-BR-120', name: 'Brantas Estuary Point', type: 'WQMS', status: 'Active', dateMaintenance: '2026-07-01 14:00:00' }
    ]
  },
  'bengawan-solo': {
    summary: { totalStations: 85, activeNodes: 80, systemHealth: 94.1, offlineCount: 3, maintCount: 2 },
    stations: [
      { id: 'NODE-BS-001', name: 'Wonogiri Dam', type: 'AWLR', status: 'Active', dateMaintenance: '2026-06-18 10:00:00' },
      { id: 'NODE-BS-015', name: 'Jurug River Point', type: 'WQMS', status: 'Active', dateMaintenance: '2026-06-25 14:00:00' },
      { id: 'NODE-BS-032', name: 'Cepu Station', type: 'ARR', status: 'Offline', dateMaintenance: '2026-04-12 12:00:00' },
      { id: 'NODE-BS-044', name: 'Bojonegoro Tributary', type: 'AWLR', status: 'Maint.', dateMaintenance: '2026-05-30 09:30:00' },
      { id: 'NODE-BS-055', name: 'Babat Point', type: 'WQMS', status: 'Active', dateMaintenance: '2026-07-10 14:10:00' }
    ]
  },
  'jratun-seluna': {
    summary: { totalStations: 92, activeNodes: 89, systemHealth: 96.7, offlineCount: 1, maintCount: 2 },
    stations: [
      { id: 'NODE-JS-001', name: 'Kedung Ombo Dam', type: 'AWLR', status: 'Active', dateMaintenance: '2026-07-05 14:20:00', reports: [{ id: 'REP-ARR-001', type: 'Maintenance', timestamp: '2023-10-01T10:00:00Z', signer: 'Admin Brantas', status: 'Pending', data: { tanggal: '01-10-2023', periode: 'Okt 2023', pelaksana: 'Teknisi 1' } }, { id: 'REP-ARR-002', type: 'Repair', timestamp: '2023-10-15T14:30:00Z', signer: 'Teknisi 1', status: 'Approved', verifierNote: 'Sesuai dengan SOP', data: { tanggal: '15-10-2023', gejalaKerusakan: 'Baterai drop', bagianPerbaikan: 'Ganti baterai', hasilVerifikasi: 'Baik', petugasVerifikasi: 'Admin', tanggalVerifikasi: '16-10-2023' } }] },
      { id: 'NODE-JS-012', name: 'Garang River', type: 'ARR', status: 'Active', dateMaintenance: '2026-06-28 13:55:00', reports: [] },
      { id: 'NODE-JS-024', name: 'Lusi River Station', type: 'WQMS', status: 'Maint.', dateMaintenance: '2026-06-03 08:15:00', reports: [] },
      { id: 'NODE-JS-038', name: 'Serang Tributary', type: 'AWLR', status: 'Offline', dateMaintenance: '2026-05-15 23:00:00', reports: [] },
      { id: 'NODE-JS-050', name: 'Juana Estuary', type: 'WQMS', status: 'Active', dateMaintenance: '2026-08-10 14:05:30', reports: [] }
    ]
  },
  'serayu-bogowonto': {
    summary: { totalStations: 64, activeNodes: 60, systemHealth: 93.7, offlineCount: 2, maintCount: 2 },
    stations: [
      { id: 'NODE-SB-008', name: 'Serayu Upper', type: 'WQMS', status: 'Active', dateMaintenance: '2026-06-22 14:01:00' },
      { id: 'NODE-SB-019', name: 'Bogowonto Point', type: 'ARR', status: 'Maint.', dateMaintenance: '2026-05-28 10:20:00' },
      { id: 'NODE-SB-027', name: 'Luk Ulo Station', type: 'AWLR', status: 'Offline', dateMaintenance: '2026-03-10 09:00:00' },
      { id: 'NODE-SB-040', name: 'Progo Tributary', type: 'WQMS', status: 'Offline', dateMaintenance: '2026-04-20 14:00:00' }
    ]
  },
  'toba-asahan': {
    summary: { totalStations: 78, activeNodes: 75, systemHealth: 96.1, offlineCount: 1, maintCount: 2 },
    stations: [
      { id: 'NODE-TA-001', name: 'Sigura-gura Dam', type: 'AWLR', status: 'Active', dateMaintenance: '2026-07-20 14:30:00' },
      { id: 'NODE-TA-011', name: 'Lake Toba Inlet', type: 'WQMS', status: 'Active', dateMaintenance: '2026-06-30 14:15:00' },
      { id: 'NODE-TA-022', name: 'Asahan River Upper', type: 'ARR', status: 'Maint.', dateMaintenance: '2026-06-02 11:00:00' },
      { id: 'NODE-TA-035', name: 'Silang River', type: 'AWLR', status: 'Offline', dateMaintenance: '2026-05-01 15:45:00' },
      { id: 'NODE-TA-048', name: 'Tanjung Balai Estuary', type: 'WQMS', status: 'Active', dateMaintenance: '2026-08-01 14:00:00' }
    ]
  }
};
