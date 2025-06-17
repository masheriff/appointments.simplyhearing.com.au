// ===================================================================
// src/lib/transformers.ts - Data Transformation Utilities
// ===================================================================
import type { 
  TimeSlot, 
  BookAppointmentRequest,
  CustomerDetailsForm 
} from '@/types/api';

// Form to API transformation
export const createBookingRequest = (
  timeSlot: TimeSlot,
  epos: string,
  appointmentReasonId: string,
  customerDetails: CustomerDetailsForm,
  campaignId?: string,
  note?: string
): BookAppointmentRequest => {
  return {
    epos,
    startDateTime: timeSlot.startDateTime,
    appointmentReasonId,
    customerDetails: {
      firstname: customerDetails.firstname,
      lastname: customerDetails.lastname,
      birthdate: customerDetails.birthdate.toISOString(),
      title: customerDetails.title,
      email: customerDetails.email,
      mobilePhone: customerDetails.mobilePhone,
      alternativePhone: customerDetails.alternativePhone || '',
    },
    campaignId: campaignId || '',
    note: note || '',
    resourceIds: timeSlot.resourceIds,
  };
};

// Data grouping and sorting utilities
export const groupTimeSlotsByDate = (timeSlots: TimeSlot[]): Record<string, TimeSlot[]> => {
  return timeSlots.reduce((acc, slot) => {
    const date = new Date(slot.startDateTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);
};

export const sortTimeSlotsByTime = (timeSlots: TimeSlot[]): TimeSlot[] => {
  return [...timeSlots].sort((a, b) => 
    new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
};