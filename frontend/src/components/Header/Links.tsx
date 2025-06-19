import { useState, type Dispatch, type SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../state/User';
import { getAuthorizedLinks } from './links';
import type { NavLink } from './links';

// Props for the Links component
interface LinksProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const Links = ({ mobileMenuOpen, setMobileMenuOpen }: LinksProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useUser();
  
  // Get the navigation links based on user permissions
  const authorizedLinks = getAuthorizedLinks(user?.roles || []);

  const handleNavItemClick = (title: string) => {
    // If clicking the currently active dropdown, close it
    if (activeDropdown === title) {
      setActiveDropdown(null);
    } else {
      // Otherwise, set it as active
      setActiveDropdown(title);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="main-nav">
      {/* Navigation list - will be hidden on mobile until hamburger is clicked */}
      <ul className={`nav-list ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {authorizedLinks.map((item: NavLink) => (
          <li 
            key={item.title} 
            className={`nav-item ${item.children && activeDropdown === item.title ? 'active' : ''}`}
          >
            {item.children ? (
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavItemClick(item.title);
                }}
              >
                {item.title}
                <span className="dropdown-arrow">▼</span>
              </a>
            ) : (
              <Link 
                to={item.path} 
                onClick={() => {
                  if (mobileMenuOpen) {
                    // Close mobile menu if clicking on a non-dropdown link
                    setMobileMenuOpen(false);
                    closeDropdowns();
                  }
                }}
              >
                {item.title}
              </Link>
            )}
            
            {item.children && activeDropdown === item.title && (
              <ul className="dropdown-menu">
                {item.children.map((child: NavLink) => (
                  <li key={child.title} className="dropdown-item">
                    <Link 
                      to={child.path}
                      onClick={() => {
                        if (mobileMenuOpen) {
                          setMobileMenuOpen(false);
                          closeDropdowns();
                        }
                      }}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Links;
