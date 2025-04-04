import { useEffect } from 'react';
import { useAuth } from '../services/auth';
import { useNavigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, token, initialize } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts or auth state changes
    if (!isLoading) {
      if (!isAuthenticated && token) {
        // If we have a token but not authenticated, try to initialize
        initialize();
      } else if (!isAuthenticated) {
        // If no token and not authenticated, redirect to login
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, token, navigate, initialize]);

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  // Only render children if authenticated
  return isAuthenticated ? <Outlet /> : null;
};