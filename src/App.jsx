import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import Categories from './pages/Categories';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Appnotifications from './pages/Appnotifications';

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
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/vendors" element={<PlaceholderPage title="Vendors" />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add" element={<PlaceholderPage title="Add User" />} />
                  <Route path="/users/:id" element={<UserDetails />} />
                  <Route path="/payments" element={<PlaceholderPage title="Payments" />} />
                  <Route path="/appnotifications" element={<Appnotifications />} />
                  <Route path="/advertisements" element={<PlaceholderPage title="Vendors Advertisements" />} />
                  <Route path="/manageemployees" element={<PlaceholderPage title="Manage Employees" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
};

export default App;