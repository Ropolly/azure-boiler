// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// HTTP request methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request options interface
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: any;
}

// Error interface
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

/**
 * Base API client for making HTTP requests
 * 
 * This service handles common API functionality like:
 * - Adding auth headers
 * - Error handling
 * - Request/response formatting
 */
class ApiService {
  /**
   * Get the authorization header with the current token
   */
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  /**
   * Format URL with query parameters
   */
  private formatUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${API_BASE_URL}${endpoint}`;
    
    if (!params) return url;
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    
    return `${url}?${queryParams.toString()}`;
  }
  
  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: HttpMethod, 
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers = {}, params, data } = options;
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...headers
      }
    };
    
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const url = this.formatUrl(endpoint, params);
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        
        if (!response.ok) {
          const error: ApiError = {
            status: response.status,
            message: responseData.message || response.statusText,
            details: responseData
          };
          throw error;
        }
        
        return responseData;
      } else {
        // Handle non-JSON responses like file downloads
        if (!response.ok) {
          const error: ApiError = {
            status: response.status,
            message: response.statusText
          };
          throw error;
        }
        
        return response as unknown as T;
      }
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      
      // Network errors or other exceptions
      throw {
        status: 0,
        message: (error as Error).message || 'Network error'
      };
    }
  }
  
  /**
   * GET request
   */
  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }
  
  /**
   * POST request
   */
  public post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, data });
  }
  
  /**
   * PUT request
   */
  public put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, data });
  }
  
  /**
   * PATCH request
   */
  public patch<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, data });
  }
  
  /**
   * DELETE request
   */
  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}

// Create a default instance to be used throughout the app
export const api = new ApiService();

export { ApiService };
