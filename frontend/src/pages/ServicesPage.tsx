import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';

/**
 * Services page component - accessible to all users
 */
export const ServicesPage = () => {
  return (
    <ProtectedRoute requiredPermission={PermissionLevel.PUBLIC}>
      <div className="page services-page">
        <div className="container">
          <h1>Our Services</h1>
          <p>Explore the services we offer to our customers.</p>
          
          <div className="services-grid">
            <div className="service-card">
              <h3>Consulting</h3>
              <p>Expert consulting services to help grow your business.</p>
              <button className="service-button">Learn More</button>
            </div>
            
            <div className="service-card">
              <h3>Implementation</h3>
              <p>Professional implementation of software solutions.</p>
              <button className="service-button">Learn More</button>
            </div>
            
            <div className="service-card">
              <h3>Support</h3>
              <p>Ongoing support for all your technical needs.</p>
              <button className="service-button">Learn More</button>
            </div>
            
            <div className="service-card">
              <h3>Training</h3>
              <p>Comprehensive training programs for your team.</p>
              <button className="service-button">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
