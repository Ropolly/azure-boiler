import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import { useUser } from '../state/User';
import { getAuthorizedLinks } from './Header/links';
import type { NavLink } from './Header/links';
import '../styles/Footer.css';

/**
 * Footer component with navigation links and ThemeSwitcher
 * Uses the same navigation structure and authorization as the Header
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useUser();
  
  // Get the same navigation links as header based on user permissions
  const authorizedLinks = getAuthorizedLinks(user?.roles || []);
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          {/* Map through top-level navigation categories */}
          {authorizedLinks.map((navItem: NavLink) => (
            <div className="footer-col" key={navItem.title}>
              <h4>{navItem.title}</h4>
              <ul>
                {/* If category has children, show them */}
                {navItem.children ? (
                  navItem.children.map((childItem: NavLink) => (
                    <li key={childItem.title}>
                      <Link to={childItem.path}>{childItem.title}</Link>
                    </li>
                  ))
                ) : (
                  /* For categories without children, just show the parent link */
                  <li>
                    <Link to={navItem.path}>{navItem.title}</Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
          
          {/* Always show the Theme Switcher */}
          <div className="footer-col">
            <h4>Appearance</h4>
            <ThemeSwitcher />
            
            <h4 className="social-header">Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Twitter" role="button"><span className="social-icon">𝕏</span></a>
              <a href="#" aria-label="LinkedIn" role="button"><span className="social-icon">in</span></a>
              <a href="#" aria-label="GitHub" role="button"><span className="social-icon">GH</span></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Azure Boilerplate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
