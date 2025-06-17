// ===================================================================
// src/api/services/appointmentService.ts
// ===================================================================
import { apiClient } from '@/lib/api';
import type { 
  AppointmentReason, 
  BookAppointmentRequest, 
  BookAppointmentResponse,
  BookedAppointment 
} from '@/types/api';

export const appointmentService = {
  fetchAppointmentReasons: async (): Promise<AppointmentReason[]> => {
    const response = await apiClient.get<AppointmentReason[]>('/api/v1/appointments/reasons');
    return response.data
      .filter(reason => reason.isActive)
      .sort((a, b) => a.appointmentReason.localeCompare(b.appointmentReason));
  },

  bookAppointment: async (bookingData: BookAppointmentRequest): Promise<BookedAppointment> => {
    const response = await apiClient.post<BookAppointmentResponse>('/api/v1/online-booking/appointments', bookingData);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Failed to book appointment');
    }
  },
};