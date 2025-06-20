import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { PermissionLevel, type PermissionLevelType } from './permissions';
import { authService } from '../../services/authService';

// Define the User type
export interface User {
  id: string;
  username: string;
  roles: PermissionLevelType[];
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Available themes - make sure these match the THEME_CHOICES in backend/users/models.py
export type ThemeType = 'light' | 'dark' | 'blue' | 'system';

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (role: PermissionLevelType) => boolean;
  selectedTheme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
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
    return savedTheme || 'system';
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
  const setTheme = async (theme: ThemeType) => {
    setSelectedTheme(theme);
    localStorage.setItem('userTheme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // If user is authenticated, save theme preference to backend
    if (user) {
      try {
        await authService.updateTheme(theme);
      } catch (error) {
        console.error('Failed to update theme preference:', error);
      }
    }
  };

  // Apply the theme on component mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  // Login function - authenticates with backend and sets the user
  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      
      // Set user and their theme
      setUser(response.user);
      
      // Set user's theme if they have one saved
      if (response.user) {
        const userTheme = localStorage.getItem('userTheme') as ThemeType || 'system';
        setSelectedTheme(userTheme);
        document.documentElement.setAttribute('data-theme', userTheme);
      }
      
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Check for existing token and load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          
          // Apply user's theme if available
          const userTheme = localStorage.getItem('userTheme') as ThemeType || 'system';
          setSelectedTheme(userTheme);
          document.documentElement.setAttribute('data-theme', userTheme);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token might be expired or invalid
          authService.clearTokens();
        }
      }
    };
    
    loadUser();
  }, []);

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
