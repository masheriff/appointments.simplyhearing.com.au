import type {
  TimeSlot,
  BookAppointmentRequest,
  CustomerDetailsForm,
  CustomerDetailsValidation,
} from "@/types/api";

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
      alternativePhone: customerDetails.alternativePhone || "",
    },
    campaignId: campaignId || "",
    note: note || "",
    resourceIds: timeSlot.resourceIds,
  };
};

// Utility function to validate customer details
export const validateCustomerDetails = (
  details: CustomerDetailsValidation
): string[] => {
  const errors: string[] = [];

  if (!details.firstname?.trim()) errors.push("First name is required");
  if (!details.lastname?.trim()) errors.push("Last name is required");
  if (!details.email?.trim()) errors.push("Email is required");
  if (!details.mobilePhone?.trim()) errors.push("Mobile phone is required");
  if (!details.birthdate) errors.push("Birth date is required");
  if (!details.title?.trim()) errors.push("Title is required");

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (details.email && !emailRegex.test(details.email)) {
    errors.push("Please enter a valid email address");
  }

  // Phone validation (basic Australian format)
  const phoneRegex = /^(\+61|0)[0-9]{9}$/;
  if (
    details.mobilePhone &&
    !phoneRegex.test(details.mobilePhone.replace(/\s/g, ""))
  ) {
    errors.push("Please enter a valid Australian mobile phone number");
  }

  // Age validation (must be at least 1 year old, not more than 120 years)
  if (details.birthdate) {
    const birthDate = new Date(details.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 1 || age > 120 || birthDate > today) {
      errors.push("Please enter a valid birth date");
    }
  }

  return errors;
};
