import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';

/**
 * Admin page component - requires admin permission
 */
export const AdminPage = () => {
  return (
    <ProtectedRoute requiredPermission={PermissionLevel.ADMIN}>
      <div className="page admin-page">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Welcome to the administration panel. This page is only visible to admin users.</p>
          
          <div className="admin-grid">
            <div className="admin-card">
              <h3>User Management</h3>
              <p>Manage users and their permissions</p>
              <button className="admin-button">Manage Users</button>
            </div>
            
            <div className="admin-card">
              <h3>Content Management</h3>
              <p>Edit website content and media</p>
              <button className="admin-button">Edit Content</button>
            </div>
            
            <div className="admin-card">
              <h3>System Settings</h3>
              <p>Configure system-wide settings</p>
              <button className="admin-button">System Config</button>
            </div>
            
            <div className="admin-card">
              <h3>Analytics</h3>
              <p>View site analytics and metrics</p>
              <button className="admin-button">View Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
