// ===================================================================
// src/api/mutations.ts - Mutation Definitions
// ===================================================================
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  BookAppointmentRequest, 
  BookAppointmentResponse,
  BookedAppointment, 
  TimeSlotsParams
} from '@/types/api';
import { queryKeys } from '@/lib/queryKeys';
import { apiClient } from '@/lib/api';

// Book Appointment API
const bookAppointmentApi = async (bookingData: BookAppointmentRequest): Promise<BookedAppointment> => {
  const response = await apiClient.post<BookAppointmentResponse>('/api/v1/online-booking/appointments', bookingData);
  
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.error?.message || 'Failed to book appointment');
  }
};

// Book Appointment Mutation
export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointmentApi,
    onSuccess: (data, variables) => {
      // Invalidate and refetch time slots for the same location/reason
      queryClient.invalidateQueries({
        queryKey: queryKeys.timeSlots.all,
        predicate: (query) => {
          const params = query.queryKey[1] as TimeSlotsParams | undefined;
          return params?.epos === variables.epos && 
                 params?.appointmentReasonId === variables.appointmentReasonId;
        }
      });

      // Invalidate infinite time slots too
      queryClient.invalidateQueries({
        queryKey: ['time-slots', 'infinite'],
      });

      // Add the new appointment to cache if you have an appointments list
      queryClient.setQueryData(
        queryKeys.appointments.byId(data.appointmentId),
        data
      );

      // Optionally show success notification
      console.log('Appointment booked successfully:', data);
    },
    onError: (error) => {
      // Handle error - could integrate with toast/notification system
      console.error('Failed to book appointment:', error);
    },
    onSettled: () => {
      // Always run after success or error
      // Could be used for analytics, cleanup, etc.
    }
  });
};