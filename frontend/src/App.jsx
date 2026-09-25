import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import DamsPage from './pages/resident/DamsPage';
import LiveTrucksPage from './pages/resident/LiveTrucksPage';
import AlertsPage from './pages/resident/AlertsPage';
import ManageDams from './pages/admin/ManageDams';
import ManageTrucks from './pages/admin/ManageTrucks';
import ManageRoutes from './pages/admin/ManageRoutes';
import DriverTripScreen from './pages/driver/DriverTripScreen';
import DriverStopsScreen from './pages/driver/DriverStopsScreen';

function PlaceholderPage({ title, description }) {
  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-8 text-center max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-[#E6EDF7] mb-2">{title}</h2>
      <p className="text-sm text-[#8A9BB8]">{description}</p>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes inside MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Resident & Common Routes */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ResidentDashboard />} />
            <Route path="dams" element={<DamsPage />} />
            <Route path="trucks" element={<LiveTrucksPage />} />
            <Route path="alerts" element={<AlertsPage />} />

            {/* Driver Role-Guarded Routes */}
            <Route
              path="driver/trip"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverTripScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="driver/stops"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverStopsScreen />
                </ProtectedRoute>
              }
            />

            {/* Admin Role-Guarded Routes inside AdminLayout */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <PlaceholderPage
                    title="Municipal Command Center"
                    description="Operational overview of municipal dams, active tankers, and resident alerts."
                  />
                }
              />
              <Route path="dams" element={<ManageDams />} />
              <Route path="trucks" element={<ManageTrucks />} />
              <Route path="routes" element={<ManageRoutes />} />
              <Route
                path="users"
                element={
                  <PlaceholderPage
                    title="User & Role Administration"
                    description="Manage municipal staff, driver accounts, and resident permissions."
                  />
                }
              />
              <Route
                path="alerts"
                element={
                  <PlaceholderPage
                    title="Broadcast Emergency Alert"
                    description="Dispatch SMS and Email alerts to subscribed Sol Plaatje residents."
                  />
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
