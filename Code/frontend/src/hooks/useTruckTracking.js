import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import useSignalR from './useSignalR';

/**
 * Custom hook managing Live Truck Tracking state, SignalR subscriptions, and server state
 */
export function useTruckTracking() {
  const { connectionStatus, trucks: signalRTrucks, lastMessageTime } = useSignalR();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruckId, setSelectedTruckId] = useState(null);

  // 1. Fetch initial truck fleet state from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchTrucks = async () => {
      try {
        const response = await apiClient.get('/api/v1/trucks');
        if (isMounted && response.data && Array.isArray(response.data)) {
          setTrucks(response.data);
        }
      } catch (err) {
        console.warn('Backend API unavailable, using initial telemetry state:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrucks();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Merge incoming SignalR telemetry updates with server state
  useEffect(() => {
    if (signalRTrucks && signalRTrucks.length > 0) {
      setTrucks((prevTrucks) => {
        if (!prevTrucks || prevTrucks.length === 0) return signalRTrucks;

        const merged = [...prevTrucks];
        signalRTrucks.forEach((sigTruck) => {
          const idx = merged.findIndex((t) => t.id === sigTruck.id || t.registrationNumber === sigTruck.registrationNumber);
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...sigTruck };
          } else {
            merged.push(sigTruck);
          }
        });
        return merged;
      });
    }
  }, [signalRTrucks]);

  const selectTruck = useCallback((id) => {
    setSelectedTruckId(id);
  }, []);

  return {
    trucks,
    loading,
    connectionStatus,
    lastMessageTime,
    selectedTruckId,
    selectTruck,
  };
}

export default useTruckTracking;
