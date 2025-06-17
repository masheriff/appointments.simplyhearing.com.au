// API Response Types
export interface AppointmentReason {
  appointmentReasonId: string;
  appointmentReason: string;
  duration: number;
  category: string;
  categoryCode: string;
  appointmentType: string | null;
  isActive: boolean;
  isResourceRequired: boolean;
}

export interface Location {
  id: string;
  name: string;
  eposNumber: string | null;
  altLocationCode: string | null;
  parentLocationId: string | null;
  parentLocationName: string | null;
  parentLocationCode: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  email: string | null;
  isActive: boolean;
  childLocations: Location[];
}

export interface TimeSlot {
  startDateTime: string; // ISO date string
  endDateTime: string;   // ISO date string
  resourceIds: string[];
}

export interface TimeSlotsData {
  epos: string;
  timeslots: TimeSlot[];
}

export interface ErrorDetail {
  propertyName: string;
  errorMessage: string;
  attemptedValue: string;
  customState: string;
  severity: string;
  errorCode: string;
  formattedMessagePlaceholderValues: string[];
}

export interface ApiError {
  message: string;
  type: string;
  notificationType: string;
  data: ErrorDetail[];
  requestId: string;
}

export interface TimeSlotsResponse {
  data: TimeSlotsData;
  success: boolean;
  error: ApiError;
}

// API Request Parameters
export interface TimeSlotsParams {
  epos: string;
  appointmentReasonId: string;
  startDate: string; // ISO date string (DateTime)
  numberOfDays: number;
}

// Customer details for booking
export interface CustomerDetails {
  firstname: string;
  lastname: string;
  birthdate: string; // ISO date string
  title: string;
  email: string;
  mobilePhone: string;
  alternativePhone: string;
}

// Customer details form input (before API conversion)
export interface CustomerDetailsForm {
  firstname: string;
  lastname: string;
  birthdate: Date; // Date object from form
  title: string;
  email: string;
  mobilePhone: string;
  alternativePhone?: string; // Optional in form
}

// Customer details validation input
export interface CustomerDetailsValidation {
  firstname?: string;
  lastname?: string;
  birthdate?: Date | string;
  title?: string;
  email?: string;
  mobilePhone?: string;
  alternativePhone?: string;
}

// Appointment booking request
export interface BookAppointmentRequest {
  epos: string;
  startDateTime: string; // ISO date string
  appointmentReasonId: string;
  customerDetails: CustomerDetails;
  campaignId: string;
  note: string;
  resourceIds: string[];
}

// Appointment booking response data
export interface BookedAppointment {
  appointmentId: string;
  startDateTime: string;
  endDateTime: string;
  epos: string;
  appointmentReasonId: string;
  patientId: string;
  resourceIds: string[];
}

// Appointment booking response
export interface BookAppointmentResponse {
  data: BookedAppointment;
  success: boolean;
  error: ApiError;
}

// Generic API Response wrapper (adjust based on your API structure)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}