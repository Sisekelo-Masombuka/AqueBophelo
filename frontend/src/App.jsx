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
import DriverTripScreen from './pages/driver/DriverTripScreen';
import DriverStopsScreen from './pages/driver/DriverStopsScreen';
import AdminOverview from './pages/admin/AdminOverview';
import ManageDams from './pages/admin/ManageDams';
import ManageTrucks from './pages/admin/ManageTrucks';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageUsers from './pages/admin/ManageUsers';
import BroadcastAlertPage from './pages/admin/BroadcastAlertPage';

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
              <Route index element={<AdminOverview />} />
              <Route path="dams" element={<ManageDams />} />
              <Route path="trucks" element={<ManageTrucks />} />
              <Route path="routes" element={<ManageRoutes />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="alerts" element={<BroadcastAlertPage />} />
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
