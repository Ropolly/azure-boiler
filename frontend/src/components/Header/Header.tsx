import { useState } from 'react';
import Logo from './Logo';
import Links from './Links';
import ProfileIcon from './ProfileIcon';
import '../../styles/Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Logo />
        
        <div className="mobile-nav-container">
          {/* Hamburger menu - centered on mobile */}
          <div 
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            role="button"
            tabIndex={0}
          >
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          </div>
        </div>
        
        <Links mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="header-right">
          <ProfileIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
