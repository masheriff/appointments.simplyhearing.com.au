// ===================================================================
// src/hooks/queries/timeslotQueries.ts
// ===================================================================
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { timeslotService } from '@/api/services/timeslotService';
import type { TimeSlotsParams } from '@/types/api';

// Time Slots Hooks
export const useTimeSlots = (params: TimeSlotsParams | null) => {
  return useQuery({
    queryKey: params ? queryKeys.timeSlots.byParams(params) : ['time-slots', 'disabled'],
    queryFn: () => {
      if (!params) throw new Error('Parameters required for time slots');
      return timeslotService.fetchTimeSlots(params);
    },
    enabled: !!params && !!params.epos && !!params.appointmentReasonId,
    staleTime: 2 * 60 * 1000, // 2 minutes for time-sensitive data
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true, // Always refetch on mount for fresh availability
  });
};

// Infinite query for loading time slots across multiple days/weeks
export const useInfiniteTimeSlots = (
  baseParams: Omit<TimeSlotsParams, 'startDate' | 'numberOfDays'>,
  startDate: Date,
  daysPerPage = 7
) => {
  return useInfiniteQuery({
    queryKey: ['time-slots', 'infinite', baseParams, startDate.toISOString()],
    queryFn: async ({ pageParam = 0 }) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (pageParam * daysPerPage));
      
      const params: TimeSlotsParams = {
        ...baseParams,
        startDate: currentDate.toISOString(),
        numberOfDays: daysPerPage,
      };
      
      return timeslotService.fetchTimeSlots(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Continue if we have slots or haven't checked enough days
      return lastPage.length > 0 || allPages.length < 4 ? allPages.length : undefined;
    },
    enabled: !!baseParams.epos && !!baseParams.appointmentReasonId,
    staleTime: 2 * 60 * 1000,
    initialPageParam: 0,
  });
};