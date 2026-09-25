import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

// Default Kimberley route waypoints for demo simulation
const KIMBERLEY_WAYPOINTS = [
  { lat: -28.7419, lng: 24.7719, speed: 28, heading: 45 },
  { lat: -28.7350, lng: 24.7650, speed: 35, heading: 60 },
  { lat: -28.7280, lng: 24.7550, speed: 42, heading: 80 },
  { lat: -28.7183, lng: 24.7319, speed: 30, heading: 120 },
  { lat: -28.7125, lng: 24.7291, speed: 25, heading: 90 },
  { lat: -28.7098, lng: 24.7245, speed: 18, heading: 110 },
];

/**
 * useGeolocationBroadcast
 * Hook to broadcast real-time driver GPS coordinates to SignalR TruckHub (/hubs/trucks).
 * Supports browser Geolocation API with automatic fallback simulation for desktop testing.
 */
export function useGeolocationBroadcast({ tripId, initialActive = false } = {}) {
  const [isBroadcasting, setIsBroadcasting] = useState(initialActive);
  const [isSimulating, setIsSimulating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Disconnected, Connecting, Connected, Error
  const [currentLocation, setCurrentLocation] = useState({
    latitude: -28.7419,
    longitude: 24.7719,
    speedKmh: 0,
    heading: 0,
    accuracyMeters: null,
    lastBroadcastTime: null,
  });
  const [error, setError] = useState(null);

  const hubConnectionRef = useRef(null);
  const watchIdRef = useRef(null);
  const simulationIntervalRef = useRef(null);
  const simStepRef = useRef(0);

  // Initialize SignalR Hub Connection
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/trucks`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.onreconnecting(() => setConnectionStatus('Reconnecting'));
    connection.onreconnected(() => setConnectionStatus('Connected'));
    connection.onclose(() => setConnectionStatus('Disconnected'));

    async function startConnection() {
      try {
        setConnectionStatus('Connecting');
        await connection.start();
        setConnectionStatus('Connected');
      } catch (err) {
        console.warn('SignalR Hub Connection warning:', err);
        setConnectionStatus('Simulated Mode (Hub Offline)');
      }
    }

    startConnection();
    hubConnectionRef.current = connection;

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Send coordinates via SignalR
  const broadcastCoordinate = useCallback(
    async (lat, lng, speed = 0, heading = 0) => {
      const now = new Date();
      setCurrentLocation((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        speedKmh: speed,
        heading: heading,
        lastBroadcastTime: now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
      }));

      if (
        hubConnectionRef.current &&
        hubConnectionRef.current.state === signalR.HubConnectionState.Connected &&
        tripId
      ) {
        try {
          await hubConnectionRef.current.invoke('SendLocation', tripId, lat, lng, speed, heading);
        } catch (err) {
          console.warn('Failed to stream location to SignalR:', err);
        }
      }
    },
    [tripId]
  );

  // Start real GPS broadcast via navigator.geolocation
  const startRealGpsBroadcast = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser. Using simulated drive.');
      setIsSimulating(true);
      return;
    }

    setIsBroadcasting(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, heading, accuracy } = pos.coords;
        const speedKmh = speed != null ? speed * 3.6 : 30; // convert m/s to km/h
        setCurrentLocation((prev) => ({ ...prev, accuracyMeters: accuracy }));
        broadcastCoordinate(latitude, longitude, speedKmh, heading || 0);
      },
      (err) => {
        console.warn('GPS watch error:', err);
        setError(`GPS signal issue (${err.message}). Starting simulation drive.`);
        setIsSimulating(true);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );
  }, [broadcastCoordinate]);

  // Handle Simulation Mode (Cycles through Kimberley coordinates)
  useEffect(() => {
    if (isSimulating && isBroadcasting) {
      simulationIntervalRef.current = setInterval(() => {
        const nextPoint = KIMBERLEY_WAYPOINTS[simStepRef.current];
        broadcastCoordinate(nextPoint.lat, nextPoint.lng, nextPoint.speed, nextPoint.heading);
        simStepRef.current = (simStepRef.current + 1) % KIMBERLEY_WAYPOINTS.length;
      }, 4000);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isSimulating, isBroadcasting, broadcastCoordinate]);

  // Stop all broadcasting
  const stopBroadcast = useCallback(() => {
    setIsBroadcasting(false);
    setIsSimulating(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  return {
    isBroadcasting,
    isSimulating,
    connectionStatus,
    currentLocation,
    error,
    startBroadcast: startRealGpsBroadcast,
    stopBroadcast,
    toggleSimulation: () => setIsSimulating((prev) => !prev),
  };
}

export default useGeolocationBroadcast;
