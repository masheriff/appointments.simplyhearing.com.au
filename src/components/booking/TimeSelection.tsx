// src/components/booking/TimeSelection.tsx - Fixed TypeScript errors
import React, { useState } from 'react';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleCalendar } from './SimpleCalendar';
import { useTimeSlots } from '@/hooks';
import { formatDateForApi } from '@/lib/formatters';
import type { TimeSlot, TimeSlotsParams, Location } from '@/types/api';

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
  selectedLocation
}) => {
  const [availableDates] = useState<string[]>([
    '2025-06-26', '2025-06-27', '2025-06-30', 
    '2025-07-01', '2025-07-02', '2025-07-03',
    '2025-07-07', '2025-07-08', '2025-07-09'
  ]);

  // Create params for the API call
  const timeSlotsParams: TimeSlotsParams | null = React.useMemo(() => {
    if (!selectedLocation || !appointmentReasonId || !selectedDate) {
      return null;
    }

    // Use the location's epos number
    const eposNumber = selectedLocation.eposNumber;
    if (!eposNumber) {
      return null;
    }

    return {
      epos: eposNumber,
      appointmentReasonId,
      startDate: formatDateForApi(new Date(selectedDate)),
      numberOfDays: 1,
    };
  }, [selectedLocation, appointmentReasonId, selectedDate]);

  // Fetch time slots using the hook
  const { 
    data: timeSlots = [], 
    isLoading: isLoadingSlots, 
    error: timeSlotsError 
  } = useTimeSlots(timeSlotsParams);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    onDateSelect(date);
    
    // Reset selected time slot when date changes - we need to handle this at the parent level
    // For now, we'll just let the parent component handle the reset
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.startDateTime);
    return start.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred appointment date and time</p>
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
                  Failed to load time slots. Please try selecting a different date.
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
                {timeSlots.map((slot, index) => (
                  <button
                    key={`${slot.startDateTime}-${index}`}
                    onClick={() => onTimeSlotSelect(slot)}
                    className={`
                      p-3 border-2 rounded-lg text-sm font-medium transition-colors
                      ${selectedTimeSlot?.startDateTime === slot.startDateTime 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {formatTimeSlot(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No available time slots for this date</p>
                <p className="text-sm mt-1">Please try selecting a different date</p>
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
    </div>
  );
};