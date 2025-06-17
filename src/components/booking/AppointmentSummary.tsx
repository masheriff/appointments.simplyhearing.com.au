// src/components/booking/AppointmentSummary.tsx
import React from "react";
import { MapPin, Clock, User, Calendar } from "lucide-react";
import type { AppointmentReason, Location, TimeSlot } from "@/types/api";

interface AppointmentSummaryProps {
  selectedReason: AppointmentReason | null;
  selectedLocation: Location | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  selectedReason,
  selectedLocation,
  selectedDate,
  selectedTimeSlot,
}) => {
  const formatLocationAddress = (location: Location): string => {
    const addressParts = [
      location.address1,
      location.address2,
      location.address3,
      location.city,
      location.zipCode,
    ].filter(Boolean);

    return addressParts.join(", ");
  };

  const formatDateForSummary = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.startDateTime);
    const end = new Date(slot.endDateTime);
    return `${start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Appointment Summary
          </h3>
        </div>
        {/* Progress Indicator */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-medium text-gray-900 mb-3">Booking Progress</h4>
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 text-sm ${
                selectedReason ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedReason ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Service Selected</span>
            </div>
            <div
              className={`flex items-center space-x-2 text-sm ${
                selectedLocation ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedLocation ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Location Selected</span>
            </div>
            <div
              className={`flex items-center space-x-2 text-sm ${
                selectedTimeSlot ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedTimeSlot ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Time Selected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span>Details & Booking</span>
            </div>
          </div>
        </div>

        {selectedReason && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Service</h4>
                <p className="text-sm text-gray-600">
                  {selectedReason.appointmentReason}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{selectedReason.duration} minutes</span>
                  <span>•</span>
                  <span>{selectedReason.category}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedLocation && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                <p className="text-sm text-gray-600">{selectedLocation.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatLocationAddress(selectedLocation)}
                </p>
                {selectedLocation.phoneNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    📞 {selectedLocation.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTimeSlot && selectedDate && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Date & Time</h4>
                <p className="text-sm text-gray-600">
                  {formatDateForSummary(selectedDate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeSlot(selectedTimeSlot)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map placeholder */}
        {selectedLocation && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location Map
            </h4>
            <div className="h-32 bg-gray-100 rounded border flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <p className="text-xs text-gray-500">Map integration</p>
                <p className="text-xs text-gray-500">coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {/* <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <a href="tel:+61422388005" className="text-blue-600 hover:underline">
                +61 422 388 005
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>✉️</span>
              <a href="mailto:info@simplyhearing.com.au" className="text-blue-600 hover:underline">
                info@simplyhearing.com.au
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
