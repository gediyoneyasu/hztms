import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Check if the user is logged in
  const user = localStorage.getItem('hztms-user');

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If logged in, render the child route
  return <Outlet />;
}
