// ===================================================================
// src/lib/formatters.ts - Display Formatting Utilities
// ===================================================================
import type { 
  AppointmentReason, 
  Location, 
  TimeSlot, 
  BookedAppointment 
} from '@/types/api';

// Location formatting
export const formatLocationAddress = (location: Location): string => {
  const addressParts = [
    location.address1,
    location.address2,
    location.address3,
    location.city,
    location.zipCode
  ].filter(Boolean);
  
  return addressParts.join(', ');
};

export const getLocationDisplayName = (location: Location): string => {
  const address = formatLocationAddress(location);
  return address ? `${location.name} - ${address}` : location.name;
};

// Time slot formatting
export const formatTimeSlot = (timeSlot: TimeSlot): string => {
  const start = new Date(timeSlot.startDateTime);
  const end = new Date(timeSlot.endDateTime);
  
  const startTime = start.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const endTime = end.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${startTime} - ${endTime}`;
};

export const getTimeSlotDuration = (timeSlot: TimeSlot): number => {
  const start = new Date(timeSlot.startDateTime);
  const end = new Date(timeSlot.endDateTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

// Appointment confirmation formatting
export const formatAppointmentConfirmation = (
  appointment: BookedAppointment,
  reason: AppointmentReason,
  location: Location
): string => {
  const startDate = new Date(appointment.startDateTime);
  const endDate = new Date(appointment.endDateTime);
  
  const dateStr = startDate.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeStr = `${startDate.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })} - ${endDate.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`;
  
  return `Your ${reason.appointmentReason} appointment has been confirmed for ${dateStr} at ${timeStr} at ${location.name}.`;
};

// Date utilities
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};

export const getDateRange = (startDate: Date, numberOfDays: number): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};