// ===================================================================
// src/lib/queryClient.ts - Query Client Configuration
// ===================================================================
import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Type guard to check if error is an Axios error
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError === true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx client errors (user/auth errors)
        if (isAxiosError(error) && error.response?.status) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        
        // Don't retry on specific error types
        if (error.name === 'ValidationError' || error.name === 'AuthenticationError') {
          return false;
        }
        
        // Retry up to 3 times for other errors (network, 5xx, etc.)
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: Error) => {
        // Only retry mutations on network errors or 5xx server errors
        if (isAxiosError(error) && error.response?.status) {
          const status = error.response.status;
          // Don't retry on 4xx client errors
          if (status >= 400 && status < 500) {
            return false;
          }
          // Retry once on 5xx server errors
          return failureCount < 1;
        }
        
        // Retry once on network errors
        return failureCount < 1;
      },
    },
  },
});