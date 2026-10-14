/**
 * AquaBophelo Frontend Unit Tests — Live Tanker Tracking & Telemetry
 */
import { describe, it, expect } from 'vitest';

describe('Live Tanker Telemetry & Municipal Fleet Tracking', () => {
  it('filters tankers accurately by municipal delivery area', () => {
    const fleet = [
      { id: 1, registrationNumber: '542-KM NC', areaId: 1, areaName: 'Galeshewe', status: 'OnTrip' },
      { id: 2, registrationNumber: '882-KM NC', areaId: 2, areaName: 'Kimberley Central', status: 'Available' },
      { id: 3, registrationNumber: '104-KM NC', areaId: 1, areaName: 'Galeshewe', status: 'Available' },
    ];

    const filterByArea = (trucks, selectedAreaId) => {
      if (!selectedAreaId || selectedAreaId === 'all') return trucks;
      return trucks.filter((t) => t.areaId === selectedAreaId);
    };

    expect(filterByArea(fleet, 'all')).toHaveLength(3);
    expect(filterByArea(fleet, 1)).toHaveLength(2);
    expect(filterByArea(fleet, 2)).toHaveLength(1);
    expect(filterByArea(fleet, 3)).toHaveLength(0);
  });

  it('calculates direction heading in degrees between two GPS coordinates', () => {
    const calculateHeading = (fromLng, fromLat, toLng, toLat) => {
      const dLng = toLng - fromLng;
      const dLat = toLat - fromLat;
      const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      return (angle + 360) % 360;
    };

    // Heading due North: same longitude, increasing latitude
    const northHeading = calculateHeading(24.75, -28.75, 24.75, -28.70);
    expect(Math.round(northHeading)).toBe(0);

    // Heading due East: increasing longitude, same latitude
    const eastHeading = calculateHeading(24.70, -28.75, 24.75, -28.75);
    expect(Math.round(eastHeading)).toBe(90);
  });

  it('updates tanker coordinates upon receiving SignalR LocationUpdated payload', () => {
    const currentTrucks = [
      { id: 1, registrationNumber: '542-KM NC', lastLatitude: -28.7183, lastLongitude: 24.7319, speedKmh: 0 },
    ];

    const incomingPayload = {
      truckId: 1,
      latitude: -28.7205,
      longitude: 24.7350,
      speedKmh: 35.5,
      heading: 120,
    };

    const updated = currentTrucks.map((t) =>
      t.id === incomingPayload.truckId
        ? {
            ...t,
            lastLatitude: incomingPayload.latitude,
            lastLongitude: incomingPayload.longitude,
            speedKmh: incomingPayload.speedKmh,
            heading: incomingPayload.heading,
          }
        : t
    );

    expect(updated[0].lastLatitude).toBe(-28.7205);
    expect(updated[0].lastLongitude).toBe(24.7350);
    expect(updated[0].speedKmh).toBe(35.5);
    expect(updated[0].heading).toBe(120);
  });
});
