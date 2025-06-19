import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../state/User';

const ProfileIcon = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setProfileDropdownOpen(false);
  };

  return (
    <div className="profile-container">
      {isAuthenticated ? (
        <>
          <div 
            className="profile-icon" 
            onClick={toggleProfileDropdown}
            title={user?.username || 'Profile'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              width="24" 
              height="24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            {user?.username && (
              <span className="username-display">{user.username}</span>
            )}
          </div>
          
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <ul>
                <li><Link to="/profile" onClick={() => setProfileDropdownOpen(false)}>My Profile</Link></li>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="login-link">
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
