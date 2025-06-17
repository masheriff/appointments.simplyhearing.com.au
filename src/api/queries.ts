// ===================================================================
// src/api/queries.ts - Query Definitions
// ===================================================================
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import type { 
  AppointmentReason, 
  Location, 
  TimeSlot,
  TimeSlotsParams,
  TimeSlotsResponse,
} from '@/types/api';

// ===================================================================
// API Functions (move from appointmentService.ts)
// ===================================================================

// Appointment Reasons API
export const fetchAppointmentReasons = async (): Promise<AppointmentReason[]> => {
  const response = await apiClient.get<AppointmentReason[]>('/api/v1/appointments/reasons');
  return response.data
    .filter(reason => reason.isActive)
    .sort((a, b) => a.appointmentReason.localeCompare(b.appointmentReason));
};

// Locations API
export const fetchLocations = async (): Promise<Location[]> => {
  const response = await apiClient.get<Location[]>('/api/v1/locations');
  return response.data
    .filter(location => location.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const fetchAllLocations = async (): Promise<Location[]> => {
  const response = await apiClient.get<Location[]>('/api/v1/locations');
  return response.data.sort((a, b) => a.name.localeCompare(b.name));
};

// Time Slots API
export const fetchTimeSlots = async (params: TimeSlotsParams): Promise<TimeSlot[]> => {
  const response = await apiClient.get<TimeSlotsResponse>('/api/v1/online-booking/timeslots', {
    params: {
      epos: params.epos,
      appointmentReasonId: params.appointmentReasonId,
      startDate: params.startDate,
      numberOfDays: params.numberOfDays,
    }
  });
  
  if (response.data.success) {
    return response.data.data.timeslots;
  } else {
    throw new Error(response.data.error?.message || 'Failed to fetch time slots');
  }
};

// ===================================================================
// React Query Hooks
// ===================================================================

// Appointment Reasons Hooks
export const useAppointmentReasons = () => {
  return useQuery({
    queryKey: queryKeys.appointmentReasons.all,
    queryFn: fetchAppointmentReasons,
    staleTime: 15 * 60 * 1000, // 15 minutes for static data
  });
};

export const useAppointmentReasonsByCategory = (category?: string) => {
  return useQuery({
    queryKey: category ? queryKeys.appointmentReasons.byCategory(category) : queryKeys.appointmentReasons.all,
    queryFn: async () => {
      const allReasons = await fetchAppointmentReasons();
      return category ? allReasons.filter(reason => reason.category === category) : allReasons;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!category, // Only run if category is provided
  });
};

export const useAppointmentReasonsByType = (appointmentType?: string) => {
  return useQuery({
    queryKey: appointmentType ? queryKeys.appointmentReasons.byType(appointmentType) : queryKeys.appointmentReasons.all,
    queryFn: async () => {
      const allReasons = await fetchAppointmentReasons();
      return appointmentType ? allReasons.filter(reason => reason.appointmentType === appointmentType) : allReasons;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!appointmentType,
  });
};

// Location Hooks
export const useLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.active,
    queryFn: fetchLocations,
    staleTime: 15 * 60 * 1000,
  });
};

export const useAllLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: fetchAllLocations,
    staleTime: 15 * 60 * 1000,
  });
};

export const useBookableLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.bookable,
    queryFn: async () => {
      const locations = await fetchLocations();
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
      const locations = await fetchAllLocations();
      return locations.find(location => location.id === locationId) || null;
    },
    enabled: !!locationId,
    staleTime: 15 * 60 * 1000,
  });
};

// Time Slots Hooks
export const useTimeSlots = (params: TimeSlotsParams | null) => {
  return useQuery({
    queryKey: params ? queryKeys.timeSlots.byParams(params) : ['time-slots', 'disabled'],
    queryFn: () => {
      if (!params) throw new Error('Parameters required for time slots');
      return fetchTimeSlots(params);
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
      
      return fetchTimeSlots(params);
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