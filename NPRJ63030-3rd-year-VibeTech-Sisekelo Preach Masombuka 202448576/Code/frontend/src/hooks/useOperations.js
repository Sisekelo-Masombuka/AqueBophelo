import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { FALLBACK_DAMS, FALLBACK_NOTICES, FALLBACK_TRUCKS } from '../data/operationsFallback';

export function useOperations() {
  const [dams, setDams] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [damsRes, trucksRes, alertsRes] = await Promise.allSettled([
        apiClient.get('api/v1/dams'),
        apiClient.get('api/v1/trucks'),
        apiClient.get('api/v1/alerts'),
      ]);

      let fallback = false;

      if (damsRes.status === 'fulfilled' && Array.isArray(damsRes.value.data) && damsRes.value.data.length) {
        setDams(
          damsRes.value.data.map((d) => ({
            ...d,
            latestLevel: d.latestLevelPercent ?? d.latestLevel ?? d.currentLevelPercent ?? 0,
            volumeMegaLitres: d.volumeMegaLitres ?? d.currentVolumeMegaLitres,
          }))
        );
      } else {
        setDams(FALLBACK_DAMS);
        fallback = true;
      }

      if (trucksRes.status === 'fulfilled' && Array.isArray(trucksRes.value.data) && trucksRes.value.data.length) {
        setTrucks(trucksRes.value.data);
      } else {
        setTrucks(FALLBACK_TRUCKS);
        fallback = true;
      }

      if (alertsRes.status === 'fulfilled' && Array.isArray(alertsRes.value.data) && alertsRes.value.data.length) {
        setNotices(
          alertsRes.value.data.map((a) => ({
            id: a.id,
            title: a.title || a.subject,
            message: a.message || a.body,
            severity: a.severity || a.level || 'Watch',
            area: a.areaName || a.area || 'Sol Plaatje',
            status: a.isActive === false ? 'Resolved' : 'Active',
            timestamp: a.createdAt || a.sentAt || a.timestamp,
            isDemo: false,
          }))
        );
      } else {
        setNotices(FALLBACK_NOTICES);
        fallback = true;
      }

      setUsingFallback(fallback);
    } catch {
      setDams(FALLBACK_DAMS);
      setTrucks(FALLBACK_TRUCKS);
      setNotices(FALLBACK_NOTICES);
      setUsingFallback(true);
      setError('We could not load the current water status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { dams, trucks, notices, loading, error, usingFallback, reload: load };
}
