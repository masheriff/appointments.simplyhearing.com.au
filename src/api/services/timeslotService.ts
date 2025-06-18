// ===================================================================
// src/api/services/timeslotService.ts - Updated with mock fallback
// ===================================================================
import { apiClient } from '@/lib/api';
import { mockTimeslotService } from './mockServices';
import type { 
  TimeSlot,
  TimeSlotsParams,
  TimeSlotsResponse,
} from '@/types/api';

// Flag to enable/disable mock mode
const USE_MOCK_DATA = false; // Set to false when API is working

export const timeslotService = {
  fetchTimeSlots: async (params: TimeSlotsParams): Promise<TimeSlot[]> => {
    if (USE_MOCK_DATA) {
      return mockTimeslotService.fetchTimeSlots(params);
    }

    try {
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
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockTimeslotService.fetchTimeSlots(params);
    }
  },
};