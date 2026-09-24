import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ResidentDashboard from './pages/resident/ResidentDashboard';

function PlaceholderPage({ title, description }) {
  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-8 text-center max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-[#E6EDF7] mb-2">{title}</h2>
      <p className="text-sm text-[#8A9BB8]">{description}</p>
    </div>
  );
}

export function App() {
  const [currentRole, setCurrentRole] = useState('Resident');

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Shell with Responsive Drawer Sidebar */}
        <Route
          path="/"
          element={
            <MainLayout
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
            />
          }
        >
          {/* Default to Resident Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ResidentDashboard />} />

          {/* Resident Feature Routes */}
          <Route
            path="dams"
            element={
              <PlaceholderPage
                title="Dam Monitoring & Trends"
                description="Dam water level gauges, capacity indicators, and Chart.js historical trend graphs."
              />
            }
          />
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

          {/* Driver Feature Routes */}
          <Route
            path="driver/trip"
            element={
              <PlaceholderPage
                title="Active Driver Trip"
                description="Driver trip controls, active route navigation, and delivery status."
              />
            }
          />
          <Route
            path="driver/stops"
            element={
              <PlaceholderPage
                title="Route Delivery Stops"
                description="List of scheduled community water points and stop completion buttons."
              />
            }
          />

          {/* Admin Feature Routes */}
          <Route
            path="admin"
            element={
              <PlaceholderPage
                title="Municipal Command Center"
                description="Operational overview of municipal dams, active tankers, and resident alerts."
              />
            }
          />
          <Route
            path="admin/dams"
            element={
              <PlaceholderPage
                title="Manage Dams & Readings"
                description="Add reservoir readings and configure threshold alert triggers."
              />
            }
          />
          <Route
            path="admin/trucks"
            element={
              <PlaceholderPage
                title="Fleet & Driver Management"
                description="Register water tankers and assign municipal drivers."
              />
            }
          />
          <Route
            path="admin/routes"
            element={
              <PlaceholderPage
                title="Routes & Delivery Stops"
                description="Configure scheduled delivery zones and water drop points."
              />
            }
          />
          <Route
            path="admin/users"
            element={
              <PlaceholderPage
                title="User & Role Administration"
                description="Manage municipal staff, driver accounts, and resident permissions."
              />
            }
          />
          <Route
            path="admin/alerts"
            element={
              <PlaceholderPage
                title="Broadcast Emergency Alert"
                description="Dispatch SMS and Email alerts to subscribed Sol Plaatje residents."
              />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
