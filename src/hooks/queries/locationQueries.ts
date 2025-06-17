// ===================================================================
// src/hooks/queries/locationQueries.ts
// ===================================================================
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { locationService } from '@/api/services/locationService';

export const useLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.active,
    queryFn: locationService.fetchLocations,
    staleTime: 15 * 60 * 1000,
  });
};

export const useAllLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: locationService.fetchAllLocations,
    staleTime: 15 * 60 * 1000,
  });
};

export const useBookableLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.bookable,
    queryFn: async () => {
      const locations = await locationService.fetchLocations();
      return locations.filter(location => location.eposNumber !== null);
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useLocationById = (locationId: string | null) => {
  return useQuery({
    queryKey: locationId ? queryKeys.locations.byId(locationId) : ['locations', 'disabled'],
    queryFn: async () => {
      if (!locationId) return null;
      const locations = await locationService.fetchAllLocations();
      return locations.find(location => location.id === locationId) || null;
    },
    enabled: !!locationId,
    staleTime: 15 * 60 * 1000,
  });
};