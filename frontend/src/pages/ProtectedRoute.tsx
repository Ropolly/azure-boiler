import { Navigate } from 'react-router-dom';
import { useUser } from '../state/User';
import { PermissionLevel, type PermissionLevelType } from '../state/User/permissions';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission: PermissionLevelType;
  redirectPath?: string;
}

/**
 * A wrapper component that redirects unauthenticated or unauthorized users
 * based on their permission level
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  redirectPath = '/login'
}: ProtectedRouteProps) => {
  const { user, hasRole } = useUser();

  // Redirect to login if not authenticated and permission required is not public
  if (!user && requiredPermission !== PermissionLevel.PUBLIC) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user has required permission
  if (!hasRole(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default ProtectedRoute;
