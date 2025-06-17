// ===================================================================
// src/api/cache.ts - Cache Management Utilities

import { queryKeys } from "@/lib/queryKeys";
import type { AppointmentReason } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

// ===================================================================
export const useCacheUtils = () => {
  const queryClient = useQueryClient();

  return {
    // Invalidate all appointment-related data
    invalidateAppointmentData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentReasons.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeSlots.all });
    },

    // Invalidate location data
    invalidateLocationData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
    },

    // Clear all cache
    clearCache: () => {
      queryClient.clear();
    },

    // Get cached data without triggering a request
    getCachedAppointmentReasons: () => {
      return queryClient.getQueryData<AppointmentReason[]>(queryKeys.appointmentReasons.all);
    },

    getCachedLocations: () => {
      return queryClient.getQueryData<Location[]>(queryKeys.locations.active);
    },

    // Set data in cache manually
    setCachedData: <T>(queryKey: readonly unknown[], data: T) => {
      queryClient.setQueryData(queryKey, data);
    },

    // Remove specific query from cache
    removeQuery: (queryKey: readonly unknown[]) => {
      queryClient.removeQueries({ queryKey });
    },
  };
};