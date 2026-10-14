import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import apiClient from '../api/client';
import { Activity, Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export function ConnectionStatus() {
  // REST API State
  const [apiStatus, setApiStatus] = useState('checking'); // checking | online | offline
  const [apiTime, setApiTime] = useState(null);
  const [apiError, setApiError] = useState(null);

  // SignalR State
  const [signalrStatus, setSignalrStatus] = useState('connecting'); // connecting | connected | reconnecting | disconnected
  const [pingResponse, setPingResponse] = useState(null);

  const hubRef = useRef(null);

  const checkRestApi = async () => {
    setApiStatus('checking');
    setApiError(null);
    try {
      const response = await apiClient.get('/api/v1/health');
      if (response.data && response.data.status === 'ok') {
        setApiStatus('online');
        setApiTime(response.data.serverTimeUtc);
      } else {
        setApiStatus('offline');
        setApiError('Received invalid health response from server.');
      }
    } catch (err) {
      setApiStatus('offline');
      if (err.code === 'ERR_NETWORK') {
        setApiError('Unable to connect to the backend server. Verify the API is running and dev certificates are trusted.');
      } else {
        setApiError(err.message || 'API health check failed.');
      }
    }
  };

  const connectSignalR = async () => {
    setSignalrStatus('connecting');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

    if (hubRef.current) {
      try {
        await hubRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/ping`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    hubRef.current = connection;

    connection.onreconnecting(() => {
      setSignalrStatus('reconnecting');
    });

    connection.onreconnected(() => {
      setSignalrStatus('connected');
      invokePing(connection);
    });

    connection.onclose(() => {
      setSignalrStatus('disconnected');
    });

    try {
      await connection.start();
      setSignalrStatus('connected');
      await invokePing(connection);
    } catch (err) {
      console.error('SignalR Connection Error:', err);
      setSignalrStatus('disconnected');
    }
  };

  const invokePing = async (conn) => {
    const activeConnection = conn || hubRef.current;
    if (activeConnection && activeConnection.state === signalR.HubConnectionState.Connected) {
      try {
        const res = await activeConnection.invoke('Ping');
        setPingResponse(res);
      } catch (e) {
        console.error('Ping invocation failed:', e);
      }
    }
  };

  useEffect(() => {
    checkRestApi();
    connectSignalR();

    return () => {
      if (hubRef.current) {
        hubRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E6EDF7] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#111B2E] border border-[#1F2C45] rounded-xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-[#1F2C45] pb-4">
          <Activity className="w-7 h-7 text-[#22D3EE]" />
          <div>
            <h1 className="text-xl font-bold text-[#E6EDF7]">AquaBophelo System Check</h1>
            <p className="text-xs text-[#8A9BB8]">Frontend ↔ Backend Foundation Test</p>
          </div>
        </div>

        {/* Status Rows */}
        <div className="space-y-4">
          
          {/* Row 1: REST API */}
          <div className="bg-[#0B1220] border border-[#1F2C45] rounded-lg p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#8A9BB8] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#22D3EE]" />
                API (REST Check)
              </span>

              {apiStatus === 'checking' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#1F2C45] text-[#8A9BB8] flex items-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8A9BB8]" />
                  Checking...
                </span>
              )}
              {apiStatus === 'online' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Online
                </span>
              )}
              {apiStatus === 'offline' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Offline
                </span>
              )}
            </div>

            {apiTime && apiStatus === 'online' && (
              <p className="text-xs text-[#8A9BB8] font-mono">
                Server Time: {new Date(apiTime).toUTCString()}
              </p>
            )}

            {apiError && apiStatus === 'offline' && (
              <p className="text-xs text-[#EF4444]">
                {apiError}
              </p>
            )}
          </div>

          {/* Row 2: SignalR */}
          <div className="bg-[#0B1220] border border-[#1F2C45] rounded-lg p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#8A9BB8] flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#22D3EE]" />
                Live Connection (SignalR)
              </span>

              {signalrStatus === 'connecting' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#1F2C45] text-[#8A9BB8] flex items-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8A9BB8]" />
                  Connecting...
                </span>
              )}
              {signalrStatus === 'connected' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              )}
              {signalrStatus === 'reconnecting' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Reconnecting...
                </span>
              )}
              {signalrStatus === 'disconnected' && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1.5 font-medium">
                  <WifiOff className="w-3.5 h-3.5" />
                  Disconnected
                </span>
              )}
            </div>

            {pingResponse && signalrStatus === 'connected' && (
              <p className="text-xs text-[#8A9BB8] font-mono">
                Ping Output: {pingResponse}
              </p>
            )}
          </div>

        </div>

        {/* Retry Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              checkRestApi();
              connectSignalR();
            }}
            className="px-4 py-2 bg-[#22D3EE] text-[#0B1220] font-semibold text-sm rounded-lg hover:bg-[#22D3EE]/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry System Check
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConnectionStatus;
