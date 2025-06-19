import { api } from './api';
import type { User } from '../state/User/UserContext';

// Types for authentication
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Authentication service for handling user auth operations
 */
class AuthService {
  /**
   * Log in a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials);
  }
  
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', data);
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post<void>('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the API call fails
    } finally {
      localStorage.removeItem('authToken');
    }
  }
  
  /**
   * Get the current user profile
   */
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  }
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  
  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  /**
   * Store the authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  
  /**
   * Clear the authentication token
   */
  clearToken(): void {
    localStorage.removeItem('authToken');
  }
}

// Export a single instance to be used throughout the app
export const authService = new AuthService();
