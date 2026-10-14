/** Demonstration fallbacks used only when the live API is unavailable. */

export const DEMO_NOTICE = 'Demonstration data — live municipal telemetry is currently unavailable.';

export const FALLBACK_DAMS = [
  {
    id: 1,
    name: 'Newton Reservoir',
    areaName: 'Kimberley Central / Sol Plaatje',
    latitude: -28.7511,
    longitude: 24.7612,
    capacityMegaLitres: 92.5,
    volumeMegaLitres: 57.8,
    latestLevel: 62.5,
    lastUpdated: 'Last known reading on file',
  },
  {
    id: 2,
    name: 'Riverton Water Works',
    areaName: 'Vaal River extraction plant',
    latitude: -28.5369,
    longitude: 24.7061,
    capacityMegaLitres: 150.0,
    volumeMegaLitres: 123.0,
    latestLevel: 82.0,
    lastUpdated: 'Last known reading on file',
  },
];

export const FALLBACK_TRUCKS = [
  {
    id: 1,
    registrationNumber: '542-KM NC',
    capacityLitres: 10000,
    status: 'OnTrip',
    lastLatitude: -28.7183,
    lastLongitude: 24.7319,
    driverName: 'Assigned driver',
    route: 'Galeshewe Zone 3',
    destination: 'Galeshewe Community Water Point',
    estimatedArrival: null,
    speedKmh: null,
  },
  {
    id: 2,
    registrationNumber: '882-KM NC',
    capacityLitres: 15000,
    status: 'OnTrip',
    lastLatitude: -28.7419,
    lastLongitude: 24.7719,
    driverName: 'Assigned driver',
    route: 'Kimberley Central',
    destination: 'Kimberley Central water point',
    estimatedArrival: null,
    speedKmh: null,
  },
  {
    id: 3,
    registrationNumber: '104-KM NC',
    capacityLitres: 10000,
    status: 'Available',
    lastLatitude: -28.6921,
    lastLongitude: 24.7088,
    driverName: 'Standby',
    route: 'Roodepan Depot',
    destination: 'Roodepan Municipal Depot',
    estimatedArrival: 'Standby',
    speedKmh: 0,
  },
];

export const FALLBACK_NOTICES = [
  {
    id: 'demo-1',
    title: 'Planned interruption — Galeshewe Zone 3',
    message:
      'A planned interruption may affect Galeshewe Zone 3 and Kimberley Central. Check this page for updates from the municipal water desk.',
    severity: 'Watch',
    area: 'Galeshewe',
    status: 'Active',
    timestamp: 'Demonstration notice',
    isDemo: true,
  },
];
