import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { DashBoard, AssetDetail, Alerts, Inventory, Reports, NotFound, Login } from './components/pages';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* The Parent Route holds the Layout */}
          <Route path="/" element={<DashboardLayout />}>

            {/* Index Redirect */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Nested Child Routes */}
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="dashboard/:id" element={<AssetDetail />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}