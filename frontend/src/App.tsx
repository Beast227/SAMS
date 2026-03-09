import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { DashBoard, AssetDetail, Alerts, Inventory, Reports, NotFound } from './components/pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}