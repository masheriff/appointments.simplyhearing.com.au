// ===================================================================
// src/api/services/appointmentService.ts - Updated with mock fallback
// ===================================================================
import { apiClient } from '@/lib/api';
import { mockAppointmentService } from './mockServices';
import type { 
  AppointmentReason, 
  BookAppointmentRequest, 
  BookAppointmentResponse,
  BookedAppointment 
} from '@/types/api';

// Flag to enable/disable mock mode
const USE_MOCK_DATA = true; // Set to false when API is working

export const appointmentService = {
  fetchAppointmentReasons: async (): Promise<AppointmentReason[]> => {
    if (USE_MOCK_DATA) {
      return mockAppointmentService.fetchAppointmentReasons();
    }

    try {
      const response = await apiClient.get<AppointmentReason[]>('/api/v1/appointments/reasons');
      return response.data
        .filter(reason => reason.isActive)
        .sort((a, b) => a.appointmentReason.localeCompare(b.appointmentReason));
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockAppointmentService.fetchAppointmentReasons();
    }
  },

  bookAppointment: async (bookingData: BookAppointmentRequest): Promise<BookedAppointment> => {
    if (USE_MOCK_DATA) {
      // Mock successful booking
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockBookedAppointment: BookedAppointment = {
        appointmentId: `mock-${Date.now()}`,
        startDateTime: bookingData.startDateTime,
        endDateTime: new Date(new Date(bookingData.startDateTime).getTime() + 30 * 60000).toISOString(),
        epos: bookingData.epos,
        appointmentReasonId: bookingData.appointmentReasonId,
        patientId: `patient-${Date.now()}`,
        resourceIds: bookingData.resourceIds,
      };
      
      return mockBookedAppointment;
    }

    try {
      const response = await apiClient.post<BookAppointmentResponse>('/api/v1/online-booking/appointments', bookingData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error?.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking API call failed:', error);
      throw new Error('Failed to book appointment. Please try again or contact support.');
    }
  },
};