// src/components/booking/ServiceSelection.tsx
import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppointmentReasons } from '@/hooks';
import type { AppointmentReason } from '@/types/api';

interface ServiceSelectionProps {
  selectedReason: AppointmentReason | null;
  onReasonSelect: (reason: AppointmentReason) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedReason,
  onReasonSelect,
  searchTerm,
  onSearchChange
}) => {
  const { data: reasons, isLoading, error } = useAppointmentReasons();

  const filteredReasons = React.useMemo(() => {
    if (!reasons) return [];
    return reasons.filter(reason =>
      reason.appointmentReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reason.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reasons, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Appointment Type</h2>
          <p className="text-gray-600">Choose the type of consultation you need</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading appointment types...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Appointment Type</h2>
          <p className="text-gray-600">Choose the type of consultation you need</p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load appointment types. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Appointment Type</h2>
        <p className="text-gray-600">Choose the type of consultation you need</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search appointment types..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredReasons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No appointment types found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto h-[55vh] px-4">
          {filteredReasons.map((reason) => (
            <div
              key={reason.appointmentReasonId}
              onClick={() => onReasonSelect(reason)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-black
                ${selectedReason?.appointmentReasonId === reason.appointmentReasonId 
                  ? 'border-[#D1AA6D] bg-[#D1AA6D]/10' 
                  : 'border-gray-200'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{reason.appointmentReason}</h3>
                  <p className="text-sm text-gray-500 mt-1">{reason.category}</p>
                </div>
                <span className="text-sm text-gray-900">{reason.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};