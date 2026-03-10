import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import DashboardSkeleton from '../ui/DashBoardSkeleton';

export default function ProtectedRoute() {
  // Zustand will trigger a re-render here as soon as 'token' becomes null.
  const { token, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return <DashboardSkeleton />;
  }

  if (!token) {
    // Redirect to login if no token is present
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}