import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import DamsPage from './pages/resident/DamsPage';

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
            <Route
              path="trucks"
              element={
                <PlaceholderPage
                  title="Live Water Tanker Tracking"
                  description="Real-time GPS tanker tracking on the Kimberley Mapbox / Leaflet map."
                />
              }
            />
            <Route
              path="alerts"
              element={
                <PlaceholderPage
                  title="Municipal Water Alerts"
                  description="Community announcements and SMS / Email subscription preferences."
                />
              }
            />

            {/* Driver Role-Guarded Routes */}
            <Route
              path="driver/trip"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <PlaceholderPage
                    title="Active Driver Trip"
                    description="Driver trip controls, active route navigation, and delivery status."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="driver/stops"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <PlaceholderPage
                    title="Route Delivery Stops"
                    description="List of scheduled community water points and stop completion buttons."
                  />
                </ProtectedRoute>
              }
            />

            {/* Admin Role-Guarded Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="Municipal Command Center"
                    description="Operational overview of municipal dams, active tankers, and resident alerts."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/dams"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="Manage Dams & Readings"
                    description="Add reservoir readings and configure threshold alert triggers."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/trucks"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="Fleet & Driver Management"
                    description="Register water tankers and assign municipal drivers."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/routes"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="Routes & Delivery Stops"
                    description="Configure scheduled delivery zones and water drop points."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="User & Role Administration"
                    description="Manage municipal staff, driver accounts, and resident permissions."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/alerts"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <PlaceholderPage
                    title="Broadcast Emergency Alert"
                    description="Dispatch SMS and Email alerts to subscribed Sol Plaatje residents."
                  />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
