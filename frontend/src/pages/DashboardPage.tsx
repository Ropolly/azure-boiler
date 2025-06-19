import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../state/User';

/**
 * Dashboard page component - requires user permission
 */
export const DashboardPage = () => {
  const { user } = useUser();

  return (
    <ProtectedRoute requiredPermission={PermissionLevel.USER}>
      <div className="page dashboard-page">
        <div className="container">
          <h1>User Dashboard</h1>
          <p>Welcome {user?.username}! This is your personalized dashboard.</p>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Account Overview</h3>
              <div className="dashboard-stats">
                <div className="stat-item">
                  <span className="stat-label">Username:</span>
                  <span className="stat-value">{user?.username}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">User ID:</span>
                  <span className="stat-value">{user?.id}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Role:</span>
                  <span className="stat-value">{user?.roles.join(', ')}</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <h3>Recent Activity</h3>
              <p>Your recent activity will be displayed here.</p>
              <div className="activity-list">
                <p>No recent activity to display.</p>
              </div>
            </div>
            
            <div className="dashboard-card">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-button">Update Profile</button>
                <button className="action-button">View Orders</button>
                <button className="action-button">Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
