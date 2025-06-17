// ===================================================================
// src/api/services/timeslotService.ts
// ===================================================================
import { apiClient } from '@/lib/api';
import type { 
  TimeSlot,
  TimeSlotsParams,
  TimeSlotsResponse,
} from '@/types/api';

export const timeslotService = {
  fetchTimeSlots: async (params: TimeSlotsParams): Promise<TimeSlot[]> => {
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
  },
};