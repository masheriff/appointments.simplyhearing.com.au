// ===================================================================
// src/hooks/queries/appointmentQueries.ts
// ===================================================================
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { appointmentService } from '@/api/services/appointmentService';
import type { AppointmentReason } from '@/types/api';

// Appointment Reasons Hooks
export const useAppointmentReasons = () => {
  return useQuery({
    queryKey: queryKeys.appointmentReasons.all,
    queryFn: appointmentService.fetchAppointmentReasons,
    staleTime: 15 * 60 * 1000, // 15 minutes for static data
  });
};

export const useAppointmentReasonsByCategory = (category?: string) => {
  return useQuery({
    queryKey: category ? queryKeys.appointmentReasons.byCategory(category) : queryKeys.appointmentReasons.all,
    queryFn: async (): Promise<AppointmentReason[]> => {
      const allReasons = await appointmentService.fetchAppointmentReasons();
      return category ? allReasons.filter(reason => reason.category === category) : allReasons;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!category,
  });
};

export const useAppointmentReasonsByType = (appointmentType?: string) => {
  return useQuery({
    queryKey: appointmentType ? queryKeys.appointmentReasons.byType(appointmentType) : queryKeys.appointmentReasons.all,
    queryFn: async (): Promise<AppointmentReason[]> => {
      const allReasons = await appointmentService.fetchAppointmentReasons();
      return appointmentType ? allReasons.filter(reason => reason.appointmentType === appointmentType) : allReasons;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!appointmentType,
  });
};