// src/components/booking/TimeSelection.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SimpleCalendar } from './SimpleCalendar';
import type { TimeSlot } from '@/types/api';

interface TimeSelectionProps {
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  locationId?: string;
  appointmentReasonId?: string;
}

// Mock time slots for now - will be replaced with real API
const mockTimeSlots: Omit<TimeSlot, 'startDateTime' | 'endDateTime'>[] = [
  { startDateTime: '09:00', endDateTime: '09:30', resourceIds: ['1'] },
  { startDateTime: '10:00', endDateTime: '10:30', resourceIds: ['1'] },
  { startDateTime: '11:00', endDateTime: '11:30', resourceIds: ['1'] },
  { startDateTime: '14:00', endDateTime: '14:30', resourceIds: ['1'] },
  { startDateTime: '15:00', endDateTime: '15:30', resourceIds: ['1'] },
  { startDateTime: '16:00', endDateTime: '16:30', resourceIds: ['1'] },
];

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedTimeSlot,
  onTimeSlotSelect,
  selectedDate,
  onDateSelect,
  locationId,
  appointmentReasonId
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Mock available dates - in real app, this would come from API
  const availableDates = [
    '2025-06-26', '2025-06-27', '2025-06-30', 
    '2025-07-01', '2025-07-02', '2025-07-03',
    '2025-07-07', '2025-07-08', '2025-07-09'
  ];

  // Handle date selection
  const handleDateSelect = (date: string) => {
    onDateSelect(date);
    
    // Reset selected time slot when date changes
    if (selectedTimeSlot) {
      onTimeSlotSelect(null as any);
    }
    
    // Load slots for the selected date
    loadTimeSlots(date);
  };

  // Mock function to load time slots - replace with real API call
  const loadTimeSlots = async (date: string) => {
    if (!locationId || !appointmentReasonId) return;
    
    setIsLoadingSlots(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock: Create time slots for the selected date
      const slotsForDate: TimeSlot[] = mockTimeSlots.map((slot, index) => ({
        startDateTime: `${date}T${slot.startDateTime}:00`,
        endDateTime: `${date}T${slot.endDateTime}:00`,
        resourceIds: slot.resourceIds
      }));
      
      setAvailableSlots(slotsForDate);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Load slots when component mounts with existing selected date
  useEffect(() => {
    if (selectedDate && locationId && appointmentReasonId) {
      loadTimeSlots(selectedDate);
    }
  }, [selectedDate, locationId, appointmentReasonId]);

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
            
            {isLoadingSlots ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse" />
                <p>Loading available time slots...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot, index) => (
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