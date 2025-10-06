import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import Loader from './Loader.js';

const ProtectedRoute = ({ children, userType = 'customer' }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on userType
    const loginPath = userType === 'admin' ? '/admin/login' : 
                     userType === 'business' ? '/business/login' : '/login';
    
    // Save the attempted location for redirect after login
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (user?.role !== userType) {
    // Redirect logged-in user to their appropriate dashboard/home
    const fallback = user?.role === 'admin' ? '/admin/dashboard'
                    : user?.role === 'business' ? '/business/dashboard'
                    : '/';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;