// src/components/booking/SimpleCalendar.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  availableDates?: string[];
  disabledDates?: string[];
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  disabledDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (day: number): string => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isDateAvailable = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Can't book in the past
    if (date < today) return false;
    
    const dateStr = formatDate(day);
    
    // Check if explicitly disabled
    if (disabledDates.includes(dateStr)) return false;
    
    // If availableDates is provided, only those dates are available
    if (availableDates.length > 0) {
      return availableDates.includes(dateStr);
    }
    
    // Default: future dates are available
    return true;
  };

  const isSelected = (day: number): boolean => {
    return selectedDate === formatDate(day);
  };

  const calendarDays = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="h-10 w-10" />
    );
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const available = isDateAvailable(day);
    const selected = isSelected(day);
    
    calendarDays.push(
      <button
        key={day}
        onClick={() => available && onDateSelect(formatDate(day))}
        disabled={!available}
        className={`
          h-10 w-10 rounded-lg text-sm font-medium transition-colors
          ${selected 
            ? 'bg-black text-white' 
            : available 
              ? 'hover:bg-gray-100 text-gray-900 border border-gray-200' 
              : 'text-gray-300 cursor-not-allowed'
          }
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-black rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 border border-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};