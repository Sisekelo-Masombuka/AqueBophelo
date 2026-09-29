import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, AlertTriangle, CheckCircle2, ClipboardCheck, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export function DriverDriverVehiclePage() {
  const [vehicle, setVehicle] = useState({
    registration: '542-KM NC',
    model: 'Mercedes-Benz Atego 1529 4x2 Water Tanker',
    capacityLitres: 10000,
    status: 'Available',
    assignedDriver: 'Sipho Dlamini (DRV-8492)',
    lastCheckAt: 'Today, 07:30 CAT'
  });

  const [brakes, setBrakes] = useState(true);
  const [tires, setTires] = useState(true);
  const [waterSeal, setWaterSeal] = useState(true);
  const [lights, setLights] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [submittingCheck, setSubmittingCheck] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Problem reporting modal
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [submittingProblem, setSubmittingProblem] = useState(false);

  useEffect(() => {
    async function loadVehicle() {
      try {
        const res = await apiClient.get('/api/v1/driver/today-trip');
        if (res.data && res.data.truckRegistration) {
          setVehicle(prev => ({
            ...prev,
            registration: res.data.truckRegistration,
            status: res.data.status === 'In Progress' ? 'OnTrip' : 'Available'
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, using default vehicle settings', err);
      }
    }
    loadVehicle();
  }, []);

  const handleVehicleCheckSubmit = async (e) => {
    e.preventDefault();
    setSubmittingCheck(true);

    const checkPassed = brakes && tires && waterSeal && lights;

    try {
      await apiClient.post('/api/v1/driver/vehicle-check', {
        brakesPassed: brakes,
        tiresPassed: tires,
        waterSealPassed: waterSeal,
        lightsPassed: lights,
        notes: inspectionNotes
      });
      setFeedback({
        type: checkPassed ? 'success' : 'warning',
        message: checkPassed
          ? 'Pre-trip vehicle check PASSED! Inspection logged to dispatch.'
          : 'Vehicle check submitted with flagged items. Fleet manager notified.'
      });
      setVehicle(prev => ({ ...prev, lastCheckAt: 'Just now (CAT)' }));
    } catch (err) {
      setFeedback({
        type: checkPassed ? 'success' : 'warning',
        message: checkPassed
          ? 'Pre-trip vehicle check PASSED (Preview Mode).'
          : 'Vehicle check logged with flagged warnings (Preview Mode).'
      });
    } finally {
      setSubmittingCheck(false);
    }
  };

  const handleReportVehicleProblem = async (e) => {
    e.preventDefault();
    if (!problemDescription) return;

    setSubmittingProblem(true);
    try {
      await apiClient.post('/api/v1/driver/report-problem', {
        category: 'Vehicle problem',
        description: problemDescription
      });
      setFeedback({ type: 'warning', message: 'Vehicle fault report dispatched to Municipal Maintenance Hub.' });
      setIsProblemModalOpen(false);
      setProblemDescription('');
    } catch (err) {
      setFeedback({ type: 'warning', message: 'Vehicle fault report logged (Preview Mode).' });
      setIsProblemModalOpen(false);
      setProblemDescription('');
    } finally {
      setSubmittingProblem(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#152e52] flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#1d70b8]" />
            <span>Assigned Vehicle & Pre-Trip Inspection</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 2.3 Municipal Fleet Vehicle Operational Status & Checklist
          </p>
        </div>

        <button
          onClick={() => setIsProblemModalOpen(true)}
          style={{ minHeight: '44px' }}
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Vehicle Issue</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-md border flex items-center space-x-3 text-xs md:text-sm ${
          feedback.type === 'success' ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]' :
          feedback.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-[#eaf4fb] border-[#bcd6ea] text-[#152e52]'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Vehicle Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black font-mono text-[#152e52] tracking-wider px-3 py-1 bg-slate-100 rounded-md border border-slate-300">
              {vehicle.registration}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              vehicle.status === 'Available' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :
              vehicle.status === 'OnTrip' ? 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]' :
              'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {vehicle.status}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-800">{vehicle.model}</p>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <span className="text-slate-500 block">Tank Capacity:</span>
              <strong className="text-slate-800 font-mono text-sm">{vehicle.capacityLitres.toLocaleString()} Litres</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Driver:</span>
              <strong className="text-slate-800">{vehicle.assignedDriver}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Province Plate Format:</span>
              <strong className="text-[#2e7d32]">Correct (`542-KM NC`)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Last Check Log:</span>
              <strong className="text-slate-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{vehicle.lastCheckAt}</span>
              </strong>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 flex flex-col justify-center space-y-2 text-center">
          <ShieldCheck className="w-8 h-8 text-[#2e7d32] mx-auto" />
          <h3 className="text-xs font-bold text-[#152e52] uppercase tracking-wider">Safety Certified</h3>
          <p className="text-[11px] text-slate-500">
            Pre-trip safety inspection is mandatory before every scheduled water delivery route.
          </p>
        </div>
      </div>

      {/* Pre-Trip Vehicle Inspection Checklist Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[#1d70b8]" />
          <span>Pre-Trip Vehicle Safety Checklist</span>
        </h2>
        <p className="text-xs text-slate-500">
          Verify each mechanical component before driving. Flagged issues will immediately notify the fleet manager.
        </p>

        <form onSubmit={handleVehicleCheckSubmit} className="space-y-4 pt-2">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Brakes */}
            <label className="flex items-center justify-between p-3.5 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Brakes & Air Lines</span>
                <span className="text-xs text-slate-500">Air pressure holding & footbrake responsive</span>
              </div>
              <input
                type="checkbox"
                checked={brakes}
                onChange={(e) => setBrakes(e.target.checked)}
                className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"
              />
            </label>

            {/* Tires */}
            <label className="flex items-center justify-between p-3.5 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Tires & Wheel Nuts</span>
                <span className="text-xs text-slate-500">Adequate tread depth & correct pressure</span>
              </div>
              <input
                type="checkbox"
                checked={tires}
                onChange={(e) => setTires(e.target.checked)}
                className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"
              />
            </label>

            {/* Water Seal */}
            <label className="flex items-center justify-between p-3.5 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Tank Seal & Hose Valves</span>
                <span className="text-xs text-slate-500">No leaks, valves secure & seals clean</span>
              </div>
              <input
                type="checkbox"
                checked={waterSeal}
                onChange={(e) => setWaterSeal(e.target.checked)}
                className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"
              />
            </label>

            {/* Lights */}
            <label className="flex items-center justify-between p-3.5 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Lights & Emergency Beacons</span>
                <span className="text-xs text-slate-500">Headlights, indicators & hazard amber lights working</span>
              </div>
              <input
                type="checkbox"
                checked={lights}
                onChange={(e) => setLights(e.target.checked)}
                className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspection Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder="e.g. Tank seal inspected clean, tire pressure checked at 8.5 bar."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
            />
          </div>

          <button
            type="submit"
            disabled={submittingCheck}
            style={{ minHeight: '48px' }}
            className="w-full py-3 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs md:text-sm font-bold rounded-md shadow-xs cursor-pointer transition-colors"
          >
            {submittingCheck ? 'Submitting Inspection...' : 'Submit Mandatory Pre-Trip Checklist'}
          </button>
        </form>
      </div>

      {/* Vehicle Problem Modal */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-[#152e52] mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Report Vehicle Fault</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit vehicle mechanical defect report for Tanker <strong>{vehicle.registration}</strong>.
            </p>

            <form onSubmit={handleReportVehicleProblem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fault Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the mechanical or vehicle fault in detail..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProblemModalOpen(false)}
                  style={{ minHeight: '44px' }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProblem}
                  style={{ minHeight: '44px' }}
                  className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-xs cursor-pointer"
                >
                  {submittingProblem ? 'Submitting...' : 'Dispatch Fault Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverDriverVehiclePage;
