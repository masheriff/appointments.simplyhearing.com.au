// src/components/booking/TimeSelection.tsx - Fixed time slots issue
import React from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleCalendar } from "./SimpleCalendar";
import { useTimeSlots } from "@/hooks";
import type { TimeSlot, TimeSlotsParams, Location } from "@/types/api";
import { Button } from "../ui/button";

interface TimeSelectionProps {
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  locationId?: string;
  appointmentReasonId?: string;
  selectedLocation?: Location | null;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedTimeSlot,
  onTimeSlotSelect,
  selectedDate,
  onDateSelect,
  appointmentReasonId,
  selectedLocation,
}) => {
  // Generate available dates for the next 30 days (excluding weekends for demo)
  const generateAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends for demo purposes
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 0 = Sunday, 6 = Saturday
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format
        dates.push(dateStr);
      }
    }

    return dates;
  };

  const availableDates = generateAvailableDates();

  // Create params for the API call
  const timeSlotsParams: TimeSlotsParams | null = React.useMemo(() => {
    if (!selectedLocation || !appointmentReasonId || !selectedDate) {
      console.log("Missing params:", {
        selectedLocation,
        appointmentReasonId,
        selectedDate,
      });
      return null;
    }

    // Use the location's epos number
    const eposNumber = selectedLocation.eposNumber;
    if (!eposNumber) {
      console.log("No epos number for location:", selectedLocation);
      return null;
    }

    // Convert selectedDate (YYYY-MM-DD) to ISO format for API
    const dateForApi = new Date(selectedDate + "T00:00:00");

    const params = {
      epos: eposNumber,
      appointmentReasonId,
      startDate: dateForApi.toISOString(),
      numberOfDays: 1,
    };

    console.log("Time slots params:", params);
    return params;
  }, [selectedLocation, appointmentReasonId, selectedDate]);

  // Fetch time slots using the hook
  const {
    data: timeSlots = [],
    isLoading: isLoadingSlots,
    error: timeSlotsError,
  } = useTimeSlots(timeSlotsParams);

  console.log("Time slots data:", {
    timeSlots,
    isLoadingSlots,
    timeSlotsError,
  });

  // Handle date selection
  const handleDateSelect = (date: string) => {
    console.log("Date selected:", date);
    onDateSelect(date);
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00"); // Ensure we're in local time
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.startDateTime);
    return start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">
          Choose your preferred appointment date and time
        </p>
      </div>

      {/* Calendar */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-3 block">
          Select Date
        </Label>
        <SimpleCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          availableDates={availableDates}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-900 mb-3 block">
              Available Times for {formatSelectedDate(selectedDate)}
            </Label>

            {timeSlotsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  Failed to load time slots. Please try selecting a different
                  date.
                </AlertDescription>
              </Alert>
            )}

            {isLoadingSlots ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading available time slots...</p>
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot, index) => {
                  const timeKey = `${slot.startDateTime}-${slot.endDateTime}-${index}`;
                  return (
                    <Button
                      variant={`${
                        selectedTimeSlot?.startDateTime === slot.startDateTime
                          ? "default"
                          : "outline"
                      }`}
                      key={timeKey}
                      onClick={() => onTimeSlotSelect(slot)}
                    >
                      {formatTimeSlot(slot)}
                    </Button>
                    // <button
                    //   key={timeKey}
                    //   onClick={() => onTimeSlotSelect(slot)}
                    //   className={`
                    //     p-3 border-2 rounded-lg text-sm font-medium transition-colors
                    //     ${selectedTimeSlot?.startDateTime === slot.startDateTime
                    //       ? 'border-black bg-black text-white'
                    //       : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    //     }
                    //   `}
                    // >
                    //   {formatTimeSlot(slot)}
                    // </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No available time slots for this date</p>
                <p className="text-sm mt-1">
                  Please try selecting a different date
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selection Message */}
      {!selectedDate && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Please select a date to view available time slots</p>
        </div>
      )}

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>Selected Date: {selectedDate}</p>
          <p>Location EPOS: {selectedLocation?.eposNumber}</p>
          <p>Appointment Reason ID: {appointmentReasonId}</p>
          <p>Time Slots Count: {timeSlots.length}</p>
          <p>Is Loading: {isLoadingSlots ? "Yes" : "No"}</p>
          {timeSlotsError && <p>Error: {String(timeSlotsError)}</p>}
        </div>
      )}
    </div>
  );
};
