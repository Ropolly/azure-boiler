import { useState, useCallback } from 'react';

// Define types for your application state
export interface AppState {
  isLoading: boolean;
  error: string | null;
  // Add more global state properties as needed
}

// Initial state
const initialState: AppState = {
  isLoading: false,
  error: null,
};

/**
 * Custom hook for global application state
 * 
 * This hook provides global state management for the application
 * without needing a complex state management library
 */
export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  // Update loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  // Set/clear error messages
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // Clear all errors
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Reset entire state to initial values
  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setLoading,
    setError,
    clearError,
    resetState
  };
};
