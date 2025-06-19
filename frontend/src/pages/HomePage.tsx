import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';

/**
 * Home page component - accessible to all users
 */
export const HomePage = () => {
  return (
    <ProtectedRoute requiredPermission={PermissionLevel.PUBLIC}>
      <div className="page home-page">
        <div className="container">
          <h1>Welcome to Our Application</h1>
          <p>This is the home page of our application, accessible to all visitors.</p>
          
          <section className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Feature 1</h3>
                <p>Description of feature 1 and its benefits.</p>
              </div>
              <div className="feature-card">
                <h3>Feature 2</h3>
                <p>Description of feature 2 and its benefits.</p>
              </div>
              <div className="feature-card">
                <h3>Feature 3</h3>
                <p>Description of feature 3 and its benefits.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};
