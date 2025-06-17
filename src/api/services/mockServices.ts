// src/api/services/mockServices.ts
import type { AppointmentReason, Location, TimeSlot, TimeSlotsParams } from '@/types/api';

// Import your sample data
import appointmentReasonsData from '@/samplejson/appointmentReasons.json';
import locationsData from '@/samplejson/locations.json';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAppointmentService = {
  fetchAppointmentReasons: async (): Promise<AppointmentReason[]> => {
    await mockDelay();
    return (appointmentReasonsData as AppointmentReason[])
      .filter(reason => reason.isActive)
      .sort((a, b) => a.appointmentReason.localeCompare(b.appointmentReason));
  },
};

export const mockLocationService = {
  fetchLocations: async (): Promise<Location[]> => {
    await mockDelay();
    return (locationsData as Location[])
      .filter(location => location.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  fetchAllLocations: async (): Promise<Location[]> => {
    await mockDelay();
    return (locationsData as Location[]).sort((a, b) => a.name.localeCompare(b.name));
  },
};

export const mockTimeslotService = {
  fetchTimeSlots: async (params: TimeSlotsParams): Promise<TimeSlot[]> => {
    await mockDelay();
    
    // Mock time slots for the requested date
    const mockTimes = [
      { start: '09:00', end: '09:30' },
      { start: '10:00', end: '10:30' },
      { start: '11:00', end: '11:30' },
      { start: '14:00', end: '14:30' },
      { start: '15:00', end: '15:30' },
      { start: '16:00', end: '16:30' },
    ];

    // Create time slots for the requested date
    const date = new Date(params.startDate);
    const dateStr = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    const timeSlots: TimeSlot[] = mockTimes.map(time => ({
      startDateTime: `${dateStr}T${time.start}:00.000Z`,
      endDateTime: `${dateStr}T${time.end}:00.000Z`,
      resourceIds: ['1']
    }));

    // Simulate some randomness - not all slots available every day
    const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
    
    return availableSlots;
  },
};