// src/types/booking.ts
export type BookingStep = 'service' | 'location' | 'time' | 'details';

export interface BookingState {
  selectedReason: import('@/types/api').AppointmentReason | null;
  selectedLocation: import('@/types/api').Location | null;
  selectedDate: string | null;
  selectedTimeSlot: import('@/types/api').TimeSlot | null;
  searchTerm: string;
}

export interface CustomerForm {
  title: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  email: string;
  mobilePhone: string;
  alternativePhone?: string;
  notes?: string;
}