import { useState, useEffect } from 'react';
import { useParams, Navigate, useOutletContext } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { WS_LIST } from '../data/mockData';
import { calculateStationStatus } from '../utils/statusHelper';
import SummaryCards from '../components/dashboard/SummaryCards';
import StationRegistryTable from '../components/dashboard/StationRegistryTable';
import './Inventory.css';

const Inventory = () => {
  const { ws } = useParams();
  const { user } = useOutletContext();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/inventory/${ws}`);
        if (response.ok) {
          const data = await response.json();
          setStations(data.stations);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [ws]);

  // Security check: if the user tries to access a different WS
  if (user?.ws !== ws && !['super-admin', 'verifier'].includes(user?.role)) {
    return <Navigate to={`/inventory/${user?.ws}`} replace />;
  }

  const currentWs = WS_LIST.find(w => w.id === ws);
  if (!currentWs) {
    return <div>Wilayah Sungai tidak ditemukan</div>;
  }

  // Calculate dynamic summary
  const dynamicSummary = {
    totalStations: stations.length,
    activeNodes: 0,
    maintCount: 0,
    offlineCount: 0,
  };

  stations.forEach(station => {
    const status = calculateStationStatus(station.dateMaintenance);
    if (status.className === 'active') dynamicSummary.activeNodes++;
    else if (status.className === 'maint') dynamicSummary.maintCount++;
    else dynamicSummary.offlineCount++; // overdue maps to offlineCount for SummaryCards
  });
  
  // simple health calc: active / total
  dynamicSummary.systemHealth = dynamicSummary.totalStations > 0 
    ? ((dynamicSummary.activeNodes / dynamicSummary.totalStations) * 100).toFixed(1) 
    : 100;

  return (
    <div className="inventory-page animate-fade-in">
      <div className="page-breadcrumb">
        <span>INVENTORY</span>
        <ChevronRight size={14} className="breadcrumb-icon" />
        <span className="active">{currentWs.name.toUpperCase()} RIVER BASIN</span>
      </div>

      <div className="page-header">
        <h1>{currentWs.name} Regional Inventory</h1>
        <p className="page-description">
          Comprehensive overview of all Automated Rainfall Recorders (ARR), Automatic Water Level 
          Recorders (AWLR), and Water Quality Monitoring Systems (WQMS) deployed across the {currentWs.name} basin network.
        </p>
      </div>

      <SummaryCards data={dynamicSummary} />

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</div>
      ) : (
        <StationRegistryTable stations={stations} />
      )}
    </div>
  );
};

export default Inventory;
