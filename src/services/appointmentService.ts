import { apiClient } from '@/lib/api';
import type{ 
  AppointmentReason, 
  Location, 
  TimeSlot, 
  TimeSlotsParams,
  TimeSlotsResponse,
  BookAppointmentRequest,
  BookAppointmentResponse,
  BookedAppointment,
  CustomerDetailsForm,
  CustomerDetailsValidation
} from '@/types/api';

// Get appointment reasons
export const getAppointmentReasons = async (): Promise<AppointmentReason[]> => {
  try {
    // Based on your API response, it seems to return the array directly, not wrapped in a data object
    const response = await apiClient.get<AppointmentReason[]>('/api/v1/appointments/reasons');
    // Filter only active reasons and sort by appointment reason name
    return response.data
      .filter(reason => reason.isActive)
      .sort((a, b) => a.appointmentReason.localeCompare(b.appointmentReason));
  } catch (error) {
    console.error('Error fetching appointment reasons:', error);
    throw error;
  }
};

// Get appointment reasons by category
export const getAppointmentReasonsByCategory = async (category?: string): Promise<AppointmentReason[]> => {
  const reasons = await getAppointmentReasons();
  if (!category) return reasons;
  return reasons.filter(reason => reason.category === category);
};

// Get appointment reasons by appointment type
export const getAppointmentReasonsByType = async (appointmentType?: string): Promise<AppointmentReason[]> => {
  const reasons = await getAppointmentReasons();
  if (!appointmentType) return reasons;
  return reasons.filter(reason => reason.appointmentType === appointmentType);
};

// Get locations
export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await apiClient.get<Location[]>('/api/v1/locations');
    // Filter only active locations and sort by name
    return response.data
      .filter(location => location.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Get all locations (including inactive ones)
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const response = await apiClient.get<Location[]>('/api/v1/locations');
    return response.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching all locations:', error);
    throw error;
  }
};

// Get location by ID
export const getLocationById = async (locationId: string): Promise<Location | null> => {
  try {
    const locations = await getAllLocations();
    return locations.find(location => location.id === locationId) || null;
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    throw error;
  }
};

// Get locations with eposNumber (these are needed for booking time slots)
export const getBookableLocations = async (): Promise<Location[]> => {
  try {
    const locations = await getLocations();
    return locations.filter(location => location.eposNumber !== null);
  } catch (error) {
    console.error('Error fetching bookable locations:', error);
    throw error;
  }
};

// Get time slots
export const getTimeSlots = async (params: TimeSlotsParams): Promise<TimeSlot[]> => {
  try {
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
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

// Book an appointment
export const bookAppointment = async (bookingData: BookAppointmentRequest): Promise<BookedAppointment> => {
  try {
    const response = await apiClient.post<BookAppointmentResponse>('/api/v1/online-booking/appointments', bookingData);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Failed to book appointment');
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

// Utility function to create booking request from form data
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

// Utility function to format location address
export const formatLocationAddress = (location: Location): string => {
  const addressParts = [
    location.address1,
    location.address2,
    location.address3,
    location.city,
    location.zipCode
  ].filter(Boolean); // Remove null/empty values
  
  return addressParts.join(', ');
};

// Utility function to get location display name with address
export const getLocationDisplayName = (location: Location): string => {
  const address = formatLocationAddress(location);
  return address ? `${location.name} - ${address}` : location.name;
};

// Utility function to validate customer details
export const validateCustomerDetails = (details: CustomerDetailsValidation): string[] => {
  const errors: string[] = [];
  
  if (!details.firstname?.trim()) errors.push('First name is required');
  if (!details.lastname?.trim()) errors.push('Last name is required');
  if (!details.email?.trim()) errors.push('Email is required');
  if (!details.mobilePhone?.trim()) errors.push('Mobile phone is required');
  if (!details.birthdate) errors.push('Birth date is required');
  if (!details.title?.trim()) errors.push('Title is required');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (details.email && !emailRegex.test(details.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Phone validation (basic Australian format)
  const phoneRegex = /^(\+61|0)[0-9]{9}$/;
  if (details.mobilePhone && !phoneRegex.test(details.mobilePhone.replace(/\s/g, ''))) {
    errors.push('Please enter a valid Australian mobile phone number');
  }
  
  // Age validation (must be at least 1 year old, not more than 120 years)
  if (details.birthdate) {
    const birthDate = new Date(details.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 1 || age > 120 || birthDate > today) {
      errors.push('Please enter a valid birth date');
    }
  }
  
  return errors;
};

// Utility function to format appointment confirmation
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

// Utility function to format date for API
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

// Utility function to format timeslot for display
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

// Utility function to get timeslot duration in minutes
export const getTimeSlotDuration = (timeSlot: TimeSlot): number => {
  const start = new Date(timeSlot.startDateTime);
  const end = new Date(timeSlot.endDateTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

// Utility function to group timeslots by date
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

// Utility function to sort timeslots by start time
export const sortTimeSlotsByTime = (timeSlots: TimeSlot[]): TimeSlot[] => {
  return [...timeSlots].sort((a, b) => 
    new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
};