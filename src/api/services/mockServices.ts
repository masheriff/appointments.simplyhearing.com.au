// src/api/services/mockServices.ts - Fixed time slot generation
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
    console.log('Mock fetchTimeSlots called with params:', params);
    await mockDelay(300); // Shorter delay for better UX
    
    // Parse the date properly
    const requestedDate = new Date(params.startDate);
    console.log('Requested date:', requestedDate);
    
    // Check if it's a weekend (for demo purposes, no appointments on weekends)
    const dayOfWeek = requestedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      console.log('Weekend - no slots available');
      return [];
    }
    
    // Mock time slots - different patterns for different days
    const allMockTimes = [
      { start: '09:00', end: '09:30' },
      { start: '09:30', end: '10:00' },
      { start: '10:00', end: '10:30' },
      { start: '10:30', end: '11:00' },
      { start: '11:00', end: '11:30' },
      { start: '11:30', end: '12:00' },
      { start: '14:00', end: '14:30' },
      { start: '14:30', end: '15:00' },
      { start: '15:00', end: '15:30' },
      { start: '15:30', end: '16:00' },
      { start: '16:00', end: '16:30' },
      { start: '16:30', end: '17:00' },
    ];

    // Create time slots for the requested date
    const year = requestedDate.getFullYear();
    const month = (requestedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = requestedDate.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    console.log('Creating slots for date string:', dateStr);

    const timeSlots: TimeSlot[] = allMockTimes.map((time, index) => ({
      startDateTime: `${dateStr}T${time.start}:00.000Z`,
      endDateTime: `${dateStr}T${time.end}:00.000Z`,
      resourceIds: [`resource-${index + 1}`]
    }));

    // Simulate realistic availability - some randomness but ensure we always have some slots
    const dayHash = dateStr.split('-').join('');
    const dayNumber = parseInt(dayHash) % 100;
    
    // Use deterministic "randomness" based on date so it's consistent
    const availableSlots = timeSlots.filter((_, index) => {
      const shouldInclude = (dayNumber + index) % 3 !== 0; // Remove roughly 1/3 of slots
      return shouldInclude;
    });

    // Ensure we always have at least 3 slots available for demo purposes
    if (availableSlots.length < 3) {
      const additionalSlots = timeSlots.slice(0, 3);
      availableSlots.push(...additionalSlots.filter(slot => 
        !availableSlots.some(existing => existing.startDateTime === slot.startDateTime)
      ));
    }

    console.log('Generated time slots:', availableSlots);
    
    return availableSlots.slice(0, 8); // Limit to 8 slots for better UI
  },
};