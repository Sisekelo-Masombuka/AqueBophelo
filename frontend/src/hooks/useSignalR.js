import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_SIGNALR_URL || 'http://localhost:5094/hubs/trucks';

// Kimberley sample initial coordinates matching backend seed data
const INITIAL_TRUCKS = [
  {
    id: 1,
    registrationNumber: '542-KM NC',
    capacityLitres: 10000,
    status: 'OnTrip',
    lastLatitude: -28.7183,
    lastLongitude: 24.7319,
    speedKmh: 35,
    heading: 95,
    driverName: 'Sipho Dlamini',
    route: 'Galeshewe Zone 3 Morning Route',
    lastUpdated: 'Live',
  },
  {
    id: 2,
    registrationNumber: '882-KM NC',
    capacityLitres: 15000,
    status: 'OnTrip',
    lastLatitude: -28.7419,
    lastLongitude: 24.7719,
    speedKmh: 42,
    heading: 180,
    driverName: 'Lerato Motsepe',
    route: 'Kimberley Central Bulk Delivery',
    lastUpdated: 'Live',
  },
  {
    id: 3,
    registrationNumber: '104-KM NC',
    capacityLitres: 10000,
    status: 'Available',
    lastLatitude: -28.6921,
    lastLongitude: 24.7088,
    speedKmh: 0,
    heading: 0,
    driverName: 'Tshepo Khumalo',
    route: 'Roodepan Municipal Depot',
    lastUpdated: 'Stationary',
  },
];

export function useSignalR() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting'); // 'Connected' | 'Reconnecting' | 'Disconnected' | 'Demo'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [lastMessageTime, setLastMessageTime] = useState(new Date().toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' }));
  const connectionRef = useRef(null);

  // Update a single truck's telemetry
  const updateTruckLocation = useCallback((data) => {
    setTrucks((prevTrucks) =>
      prevTrucks.map((truck) => {
        if (truck.id === data.truckId || truck.registrationNumber === data.registrationNumber) {
          return {
            ...truck,
            lastLatitude: data.latitude ?? data.lastLatitude ?? truck.lastLatitude,
            lastLongitude: data.longitude ?? data.lastLongitude ?? truck.lastLongitude,
            speedKmh: data.speedKmh ?? truck.speedKmh,
            heading: data.heading ?? truck.heading,
            status: data.status || truck.status,
            lastUpdated: new Date().toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' }) + ' CAT',
          };
        }
        return truck;
      })
    );
    setLastMessageTime(new Date().toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' }));
  }, []);

  useEffect(() => {
    let isMounted = true;
    let fallbackSimulationTimer = null;

    // 1. Build SignalR Connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('aquabophelo_token') || '',
        skipNegotiation: false,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // 2. Lifecycle event handlers (HCI Heuristic #1: Visibility of System Status)
    connection.onreconnecting(() => {
      if (isMounted) setConnectionStatus('Reconnecting');
    });

    connection.onreconnected(() => {
      if (isMounted) setConnectionStatus('Connected');
    });

    connection.onclose(() => {
      if (isMounted) setConnectionStatus('Disconnected');
    });

    // 3. Register Hub Callbacks matching backend TruckHub.cs
    connection.on('LocationUpdated', (payload) => {
      if (isMounted && payload) {
        updateTruckLocation(payload);
      }
    });

    connection.on('TripStarted', (trip) => {
      if (isMounted && trip) {
        updateTruckLocation({
          truckId: trip.truckId,
          status: 'OnTrip',
        });
      }
    });

    connection.on('TripEnded', (trip) => {
      if (isMounted && trip) {
        updateTruckLocation({
          truckId: trip.truckId,
          status: 'Available',
        });
      }
    });

    // 4. Start connection or fallback to Telemetry Simulator
    const startHub = async () => {
      try {
        await connection.start();
        if (isMounted) {
          setConnectionStatus('Connected');
          // Join default Sol Plaatje Kimberley area group
          try {
            await connection.invoke('JoinAreaGroup', 1);
          } catch {
            // Ignore if group join fails
          }
        }
      } catch (err) {
        // If the backend API isn't currently running, switch gracefully to simulated live GPS telemetry
        if (isMounted) {
          setConnectionStatus('Demo');

          // Smooth simulated GPS movement along Galeshewe and Kimberley Central
          let step = 0;
          fallbackSimulationTimer = setInterval(() => {
            if (!isMounted) return;
            step += 0.05;
            // Oscillate slightly around Kimberley coordinates to simulate live movement
            const deltaLat1 = Math.sin(step) * 0.0025;
            const deltaLng1 = Math.cos(step) * 0.0025;
            const deltaLat2 = Math.cos(step * 0.8) * 0.003;
            const deltaLng2 = Math.sin(step * 0.8) * 0.003;

            updateTruckLocation({
              truckId: 1,
              latitude: -28.7183 + deltaLat1,
              longitude: 24.7319 + deltaLng1,
              speedKmh: Math.floor(25 + Math.sin(step) * 12),
              heading: (Math.floor(step * 45) % 360),
            });

            updateTruckLocation({
              truckId: 2,
              latitude: -28.7419 + deltaLat2,
              longitude: 24.7719 + deltaLng2,
              speedKmh: Math.floor(35 + Math.cos(step) * 15),
              heading: (Math.floor(180 + step * 30) % 360),
            });
          }, 3500);
        }
      }
    };

    startHub();

    return () => {
      isMounted = false;
      if (fallbackSimulationTimer) clearInterval(fallbackSimulationTimer);
      if (connection) {
        connection.stop().catch(() => {});
      }
    };
  }, [updateTruckLocation]);

  return {
    connectionStatus,
    trucks,
    lastMessageTime,
  };
}

export default useSignalR;
