// src/components/booking/BookingSystem.tsx
import React, { useState } from "react";
import { Search, MapPin, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookAppointment } from "@/hooks";
import { createBookingRequest } from "@/lib/transformers";

// Component imports
import { ProgressStep } from "./ProgressStep";
import { ServiceSelection } from "./ServiceSelection";
import { LocationSelection } from "./LocationSelection";
import { TimeSelection } from "./TimeSelection";
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { AppointmentSummary } from "./AppointmentSummary";

// Types
import type { BookingStep, BookingState, CustomerForm } from "@/types/booking";
import type { AppointmentReason, Location, TimeSlot } from "@/types/api";

export const BookingSystem: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedReason: null,
    selectedLocation: null,
    selectedDate: null,
    selectedTimeSlot: null,
    searchTerm: "",
  });

  // Booking mutation
  const bookAppointmentMutation = useBookAppointment();

  const canContinue = (): boolean => {
    switch (currentStep) {
      case "service":
        return bookingState.selectedReason !== null;
      case "location":
        return bookingState.selectedLocation !== null;
      case "time":
        return bookingState.selectedTimeSlot !== null;
      case "details":
        return false; // Handled by form validation
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const steps: BookingStep[] = ["service", "location", "time", "details"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ["service", "location", "time", "details"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Handler functions
  const handleReasonSelect = (reason: AppointmentReason) => {
    setBookingState((prev) => ({ ...prev, selectedReason: reason }));
  };

  const handleLocationSelect = (location: Location) => {
    setBookingState((prev) => ({ ...prev, selectedLocation: location }));
  };

  const handleDateSelect = (date: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
      // Reset time slot when date changes
      selectedTimeSlot:
        prev.selectedDate !== date ? null : prev.selectedTimeSlot,
    }));
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setBookingState((prev) => ({ ...prev, selectedTimeSlot: timeSlot }));
  };

  const handleSearchChange = (term: string) => {
    setBookingState((prev) => ({ ...prev, searchTerm: term }));
  };

  // Form submission
  const handleFormSubmit = async (customerData: CustomerForm) => {
    if (
      !bookingState.selectedTimeSlot ||
      !bookingState.selectedLocation ||
      !bookingState.selectedReason
    ) {
      throw new Error("Missing booking information");
    }

    const bookingRequest = createBookingRequest(
      bookingState.selectedTimeSlot,
      bookingState.selectedLocation.eposNumber || "",
      bookingState.selectedReason.appointmentReasonId,
      customerData,
      "", // campaignId - optional
      customerData.notes || ""
    );

    await bookAppointmentMutation.mutateAsync(bookingRequest);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelection
            selectedReason={bookingState.selectedReason}
            onReasonSelect={handleReasonSelect}
            searchTerm={bookingState.searchTerm}
            onSearchChange={handleSearchChange}
          />
        );

      case "location":
        return (
          <LocationSelection
            selectedLocation={bookingState.selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        );

      case "time":
        return (
          <TimeSelection
            selectedTimeSlot={bookingState.selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            selectedDate={bookingState.selectedDate}
            onDateSelect={handleDateSelect}
            selectedLocation={bookingState.selectedLocation}
            appointmentReasonId={
              bookingState.selectedReason?.appointmentReasonId
            }
          />
        );

      case "details":
        return (
          <CustomerDetailsForm
            onSubmit={handleFormSubmit}
            isSubmitting={bookAppointmentMutation.isPending}
            submitError={bookAppointmentMutation.error?.message || null}
            submitSuccess={bookAppointmentMutation.isSuccess}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-white container sm:mx-auto mx-4 flex border">
      {/* Left Panel - Main Flow */}
      <div className="flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="border-b border-gray-200  w-full ">
          <div className="max-w-3xl sm:mx-auto mx-4  flex items-center h-[64px] justify-between">
            <ProgressStep
              step="service"
              currentStep={currentStep}
              title="Service"
              icon={Search}
            />
            <ProgressStep
              step="location"
              currentStep={currentStep}
              title="Location"
              icon={MapPin}
            />
            <ProgressStep
              step="time"
              currentStep={currentStep}
              title="Date & Time"
              icon={Calendar}
            />
            <ProgressStep
              step="details"
              currentStep={currentStep}
              title="Details"
              icon={User}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-xl mx-auto">{renderCurrentStep()}</div>
        </div>

        {/* Navigation */}
        {!bookAppointmentMutation.isSuccess && (
          <div className="border-t border-gray-200 w-full">
            <div className="max-w-3xl sm:mx-auto mx-4  flex items-center h-[64px] justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={
                  currentStep === "service" || bookAppointmentMutation.isPending
                }
                className="px-6"
              >
                Back
              </Button>
              {currentStep !== "details" && (
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue() || bookAppointmentMutation.isPending}
                  className="px-6 bg-black hover:bg-gray-800"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Appointment Summary */}
      <AppointmentSummary
        selectedReason={bookingState.selectedReason}
        selectedLocation={bookingState.selectedLocation}
        selectedDate={bookingState.selectedDate}
        selectedTimeSlot={bookingState.selectedTimeSlot}
      />
    </div>
  );
};
