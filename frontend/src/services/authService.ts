import { api } from './api';
import type { User, ThemeType } from '../state/User/UserContext';
import { PermissionLevel, type PermissionLevelType } from '../state/User/permissions';

// Types for authentication
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  selected_theme?: ThemeType;
  roles?: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  roles: string;
  selected_theme: string;
}

/**
 * Authentication service for handling user auth operations
 */
class AuthService {
  /**
   * Log in a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // The backend returns { tokens: { access, refresh }, user: {...} }
    const response = await api.post<{ tokens: TokenResponse, user: UserProfile }>('/users/auth/login/', credentials);
    
    // Store tokens
    this.setToken(response.tokens.access);
    this.setRefreshToken(response.tokens.refresh);
    
    // Convert backend user format to frontend User type
    const user: User = {
      id: response.user.id,
      username: response.user.username,
      roles: this.convertRoles(response.user.roles),
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      avatar: response.user.avatar
    };
    
    return {
      access: response.tokens.access,
      refresh: response.tokens.refresh,
      user
    };
  }
  
  /**
   * Convert roles string from backend to frontend PermissionLevelType[]
   */
  private convertRoles(roles: string): PermissionLevelType[] {
    // Split the comma-separated roles and filter for valid permission levels
    return roles.split(',').map(role => {
      const trimmedRole = role.trim();
      
      // Verify it's a valid PermissionLevel
      switch(trimmedRole) {
        case PermissionLevel.PUBLIC:
          return PermissionLevel.PUBLIC;
        case PermissionLevel.USER:
          return PermissionLevel.USER;
        case PermissionLevel.ADMIN:
          return PermissionLevel.ADMIN; 
        case PermissionLevel.SUPER_ADMIN:
          return PermissionLevel.SUPER_ADMIN;
        default:
          return PermissionLevel.PUBLIC;
      }
    });
  }
  
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // The unused response variable was causing a TS warning
    await api.post<{ user: UserProfile, message: string }>('/users/auth/register/', data);
    
    // After registration, user needs to login
    return this.login({
      username: data.username,
      password: data.password
    });
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await api.post<void>('/users/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }
  
  /**
   * Get the current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<UserProfile>('/users/profile/');
    
    // Convert backend user format to frontend User type
    return {
      id: response.id,
      username: response.username,
      roles: this.convertRoles(response.roles),
      firstName: response.first_name,
      lastName: response.last_name,
      avatar: response.avatar
    };
  }
  
  /**
   * Update the user's selected theme
   */
  async updateTheme(theme: ThemeType): Promise<void> {
    await api.post<{selected_theme: string}>('/users/profile/update-theme/', { theme });
  }
  
  /**
   * Refresh the access token using the refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<{access: string}>('/users/auth/refresh/', {
      refresh: refreshToken
    });
    
    this.setToken(response.access);
    return response.access;
  }
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
  
  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  /**
   * Get the stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  
  /**
   * Store the authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }
  
  /**
   * Store the refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }
  
  /**
   * Clear the authentication token
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Export a single instance to be used throughout the app
export const authService = new AuthService();
