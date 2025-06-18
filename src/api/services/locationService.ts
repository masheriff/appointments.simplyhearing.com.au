// ===================================================================
// src/api/services/locationService.ts - Updated with mock fallback
// ===================================================================
import { apiClient } from '@/lib/api';
import { mockLocationService } from './mockServices';
import type { Location } from '@/types/api';

// Flag to enable/disable mock mode
const USE_MOCK_DATA = false; // Set to false when API is working

export const locationService = {
  fetchLocations: async (): Promise<Location[]> => {
    if (USE_MOCK_DATA) {
      return mockLocationService.fetchLocations();
    }

    try {
      const response = await apiClient.get<Location[]>('/api/v1/locations');
      return response.data
        .filter(location => location.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockLocationService.fetchLocations();
    }
  },

  fetchAllLocations: async (): Promise<Location[]> => {
    if (USE_MOCK_DATA) {
      return mockLocationService.fetchAllLocations();
    }

    try {
      const response = await apiClient.get<Location[]>('/api/v1/locations');
      return response.data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockLocationService.fetchAllLocations();
    }
  },
};