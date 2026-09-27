import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Sliders, ShieldCheck } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_SIGNALR_URL || 'https://localhost:7154/hubs/trucks';

// Kimberley road corridors for simulation (Galeshewe, Kimberley Central, Newton)
const SIMULATION_CORRIDORS = {
  1: [
    [24.7685, -28.7485],
    [24.7700, -28.7420],
    [24.7675, -28.7395],
    [24.7645, -28.7360],
    [24.7580, -28.7315],
    [24.7510, -28.7270],
    [24.7430, -28.7210],
    [24.7350, -28.7145],
    [24.7260, -28.7065],
    [24.7180, -28.6975],
  ],
  2: [
    [24.7725, -28.7425],
    [24.7660, -28.7405],
    [24.7585, -28.7355],
    [24.7505, -28.7305],
    [24.7435, -28.7255],
    [24.7365, -28.7210],
    [24.7295, -28.7160],
  ],
  3: [
    [24.7612, -28.7511],
    [24.7655, -28.7535],
    [24.7695, -28.7475],
    [24.7680, -28.7410],
    [24.7645, -28.7365],
  ],
};

function calculateHeading(fromLng, fromLat, toLng, toLat) {
  const dLng = toLng - fromLng;
  const dLat = toLat - fromLat;
  const angleRad = Math.atan2(dLng, dLat);
  const deg = Math.round((angleRad * 180) / Math.PI);
  return (deg + 360) % 360;
}

export function DemoSimulationControls() {
  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x, 5x, 10x
  const [activeTruckId, setActiveTruckId] = useState(1);
  const connectionRef = useRef(null);

  const simulationStateRef = useRef({
    1: { segmentIndex: 0, progress: 0.1, direction: 1 },
    2: { segmentIndex: 0, progress: 0.2, direction: 1 },
    3: { segmentIndex: 0, progress: 0.0, direction: 1 },
  });

  // Connect Driver/System SignalR connection for pushing real GPS telemetry through backend
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('aquabophelo_token') || '',
        skipNegotiation: false,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.start().catch(() => {});
    connectionRef.current = connection;

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  // Telemetry simulation timer: sends GPS data via SignalR -> Backend SendLocation -> Hub validation -> Broadcast
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = Math.max(200, Math.floor(1500 / speedMultiplier));

    const interval = setInterval(() => {
      const conn = connectionRef.current;
      const truckIds = [1, 2];

      truckIds.forEach((truckId) => {
        const routePoints = SIMULATION_CORRIDORS[truckId] || SIMULATION_CORRIDORS[1];
        const numSegments = routePoints.length - 1;
        const state = simulationStateRef.current[truckId];

        state.progress += 0.05 * speedMultiplier;

        if (state.progress >= 1.0) {
          state.progress = 0.0;
          state.segmentIndex += state.direction;

          if (state.segmentIndex >= numSegments) {
            state.segmentIndex = numSegments - 1;
            state.direction = -1;
          } else if (state.segmentIndex < 0) {
            state.segmentIndex = 0;
            state.direction = 1;
          }
        }

        const fromPoint = routePoints[state.segmentIndex];
        const nextIndex = state.segmentIndex + state.direction;
        const toPoint = routePoints[nextIndex >= 0 && nextIndex < routePoints.length ? nextIndex : state.segmentIndex];

        const lng = fromPoint[0] + (toPoint[0] - fromPoint[0]) * state.progress;
        const lat = fromPoint[1] + (toPoint[1] - fromPoint[1]) * state.progress;
        const heading = calculateHeading(fromPoint[0], fromPoint[1], toPoint[0], toPoint[1]);
        const speedKmh = Math.floor(30 + Math.sin(Date.now() / 1000) * 10) * Math.min(speedMultiplier, 2);

        // Push location update through backend SignalR SendLocation endpoint
        if (conn && conn.state === signalR.HubConnectionState.Connected) {
          conn.invoke('SendLocation', truckId, lat, lng, speedKmh, heading).catch(() => {});
        }
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRunning, speedMultiplier]);

  // Dev mode check: Only render in development / demo mode
  if (!import.meta.env.DEV) return null;

  return (
    <div className="bg-slate-900/90 dark:bg-[#111B2E]/90 backdrop-blur-md border border-slate-700 dark:border-[#1F2C45] rounded-2xl p-4 shadow-2xl text-slate-100 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-sky-400">
            Demo Telemetry Control Panel
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
            Dev Mode
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Telemetry' : 'Start Simulation'}</span>
          </button>

          <button
            onClick={() => {
              simulationStateRef.current = {
                1: { segmentIndex: 0, progress: 0.1, direction: 1 },
                2: { segmentIndex: 0, progress: 0.2, direction: 1 },
                3: { segmentIndex: 0, progress: 0.0, direction: 1 },
              };
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition-colors cursor-pointer"
            title="Reset Positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speed Multiplier Controls: 1x, 5x, 10x */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Simulation Speed:</span>
        <div className="flex items-center space-x-1.5">
          {[1, 5, 10].map((multiplier) => (
            <button
              key={multiplier}
              onClick={() => setSpeedMultiplier(multiplier)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                speedMultiplier === multiplier
                  ? 'bg-sky-500 text-slate-950 font-black shadow-sky-500/30 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {multiplier}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DemoSimulationControls;
