import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; 

export default function ProtectedRoute() {
  // Zustand will trigger a re-render here as soon as 'token' becomes null.
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // Redirect to login if no token is present
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}