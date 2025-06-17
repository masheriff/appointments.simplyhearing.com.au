// ===================================================================
// src/api/prefetch.ts - Prefetching Utilities

import { queryKeys } from "@/lib/queryKeys";
import type { TimeSlotsParams } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAppointmentReasons, fetchLocations, fetchTimeSlots } from "./queries";

// ===================================================================
export const usePrefetchQueries = () => {
  const queryClient = useQueryClient();

  return {
    // Prefetch appointment reasons (good for initial app load)
    prefetchAppointmentReasons: () => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.appointmentReasons.all,
        queryFn: fetchAppointmentReasons,
        staleTime: 15 * 60 * 1000,
      });
    },

    // Prefetch locations
    prefetchLocations: () => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.locations.active,
        queryFn: fetchLocations,
        staleTime: 15 * 60 * 1000,
      });
    },

    // Prefetch time slots (good for when user hovers over date picker)
    prefetchTimeSlots: (params: TimeSlotsParams) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.timeSlots.byParams(params),
        queryFn: () => fetchTimeSlots(params),
        staleTime: 2 * 60 * 1000,
      });
    },
  };
};