import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import DamsPage from './pages/resident/DamsPage';
import LiveTrucksPage from './pages/resident/LiveTrucksPage';
import AlertsPage from './pages/resident/AlertsPage';
import ProfilePage from './pages/ProfilePage';
import DriverTripScreen from './pages/driver/DriverTripScreen';
import DriverStopsScreen from './pages/driver/DriverStopsScreen';
import AdminOverview from './pages/admin/AdminOverview';
import ManageDams from './pages/admin/ManageDams';
import ManageTrucks from './pages/admin/ManageTrucks';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageUsers from './pages/admin/ManageUsers';
import BroadcastAlertPage from './pages/admin/BroadcastAlertPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/landing" replace />;
  }

  if (user.role === 'Admin') return <Navigate to="/admin" replace />;
  if (user.role === 'Driver') return <Navigate to="/driver/trip" replace />;
  return <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Alias Navigation Links */}
          <Route path="/water-services" element={<AboutUsPage />} />
          <Route path="/notices" element={<ContactUsPage />} />

          {/* Root Smart Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Application Routes inside MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Resident & Common Routes */}
            <Route path="dashboard" element={<ResidentDashboard />} />
            <Route path="dams" element={<DamsPage />} />
            <Route path="trucks" element={<LiveTrucksPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="profile" element={<ProfilePage />} />

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
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
