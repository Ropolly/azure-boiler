import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { PermissionLevel, type PermissionLevelType } from './permissions';

// Define the User type
export interface User {
  id: string;
  username: string;
  roles: PermissionLevelType[];
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Available themes
export type ThemeType = 'default' | 'dark' | 'high-contrast' | 'solarized-light';

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: PermissionLevelType) => boolean;
  selectedTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create context with a default value
const UserContext = createContext<UserContextType | null>(null);

// User Provider props
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('userTheme') as ThemeType;
    return savedTheme || 'default';
  });

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Check if user has a specific role
  const hasRole = (role: PermissionLevelType): boolean => {
    if (!user) return role === PermissionLevel.PUBLIC;
    
    // Super admins have all permissions
    if (user.roles.includes(PermissionLevel.SUPER_ADMIN)) {
      return true;
    }
    
    return user.roles.includes(role);
  };

  // Set theme function
  const setTheme = (theme: ThemeType) => {
    setSelectedTheme(theme);
    localStorage.setItem('userTheme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Apply the theme on component mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  // Login function - processes token and sets the user
  const login = async (token: string) => {
    try {
      // In a real app, you would validate the token and fetch user data
      // This is just a placeholder
      if (token) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // For demo, create a mock user
        // In production, you'd decode the token or make an API call
        const mockUser: User = {
          id: '1',
          username: 'demouser',
          roles: [PermissionLevel.USER]
        };
        
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      login, 
      logout,
      hasRole,
      selectedTheme,
      setTheme
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
