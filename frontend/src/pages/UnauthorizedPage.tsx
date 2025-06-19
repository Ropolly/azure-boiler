import { Link } from 'react-router-dom';
import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';

export const UnauthorizedPage = () => {
  return (
    <ProtectedRoute requiredPermission={PermissionLevel.PUBLIC}>
      <div className="page unauthorized-page">
        <div className="container">
          <h1>Access Denied</h1>
          <p>You do not have permission to access the requested page.</p>
          
          <div className="unauthorized-actions">
            <Link to="/" className="btn btn-primary">Return to Home</Link>
            <Link to="/login" className="btn btn-secondary">Login with Different Account</Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
