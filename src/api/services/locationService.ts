// ===================================================================
// src/api/services/locationService.ts
// ===================================================================
import { apiClient } from '@/lib/api';
import type { Location } from '@/types/api';

export const locationService = {
  fetchLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>('/api/v1/locations');
    return response.data
      .filter(location => location.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  fetchAllLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>('/api/v1/locations');
    return response.data.sort((a, b) => a.name.localeCompare(b.name));
  },
};