import { PermissionLevel } from '../state/User/permissions';
import ProtectedRoute from './ProtectedRoute';

/**
 * Products page component - accessible to all users
 */
export const ProductsPage = () => {
  return (
    <ProtectedRoute requiredPermission={PermissionLevel.PUBLIC}>
      <div className="page products-page">
        <div className="container">
          <h1>Products</h1>
          <p>Browse our selection of products.</p>
          
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="product-card">
                <div className="product-image-placeholder"></div>
                <h3>Product {index + 1}</h3>
                <p>Description for product {index + 1}</p>
                <div className="product-price">$99.99</div>
                <button className="product-button">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
