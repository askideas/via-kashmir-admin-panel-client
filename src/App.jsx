import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<PlaceholderPage title="Bookings" />} />
                  <Route path="/vendors" element={<PlaceholderPage title="Vendors" />} />
                  <Route path="/users" element={<PlaceholderPage title="Users" />} />
                  <Route path="/payments" element={<PlaceholderPage title="Payments" />} />
                  <Route path="/appnotifications" element={<PlaceholderPage title="App Notifications" />} />
                  <Route path="/advertisements" element={<PlaceholderPage title="Vendors Advertisements" />} />
                  <Route path="/manageemployees" element={<PlaceholderPage title="Manage Employees" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;