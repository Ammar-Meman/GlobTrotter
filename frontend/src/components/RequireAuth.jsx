import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  // TODO: integrate with authStore
  const isAuthenticated = false; // Mock

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
