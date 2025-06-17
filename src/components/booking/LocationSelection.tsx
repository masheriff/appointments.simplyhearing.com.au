// src/components/booking/LocationSelection.tsx
import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocations } from '@/hooks';
import type { Location } from '@/types/api';

interface LocationSelectionProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  selectedLocation,
  onLocationSelect
}) => {
  const { data: locations, isLoading, error } = useLocations();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Location</h2>
          <p className="text-gray-600">Choose your preferred clinic location</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Location</h2>
          <p className="text-gray-600">Choose your preferred clinic location</p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load locations. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatLocationAddress = (location: Location): string => {
    const addressParts = [
      location.address1,
      location.address2,
      location.address3,
      location.city,
      location.zipCode
    ].filter(Boolean);
    
    return addressParts.join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Location</h2>
        <p className="text-gray-600">Choose your preferred clinic location</p>
      </div>

      {!locations || locations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No locations available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => onLocationSelect(location)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-gray-300
                ${selectedLocation?.id === location.id 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-200'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatLocationAddress(location)}
                  </p>
                  {location.phoneNumber && (
                    <p className="text-sm text-gray-500 mt-1">
                      📞 {location.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};