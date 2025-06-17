// src/components/booking/AppointmentSummary.tsx
import React from "react";
import { MapPin, Clock, User, Calendar, Phone } from "lucide-react";
import type { AppointmentReason, Location, TimeSlot } from "@/types/api";

interface AppointmentSummaryProps {
  selectedReason: AppointmentReason | null;
  selectedLocation: Location | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  isBookingComplete?: boolean;
}

// Map embed URLs for each location
const locationMaps: Record<string, string> = {
  "Broadbeach": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.617207808565!2d153.42336127547904!3d-28.036173275995594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b9105da0246bac7%3A0x82c3d854bc17c348!2sSimply%20Hearing%20%7C%20Ear%20Wax%20Cleaning!5e0!3m2!1sen!2sin!4v1750169028779!5m2!1sen!2sin",
  "Pimpama": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.617207808565!2d153.42336127547904!3d-28.036173275995594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b9105da0246bac7%3A0x82c3d854bc17c348!2sSimply%20Hearing%20%7C%20Ear%20Wax%20Cleaning!5e0!3m2!1sen!2sin!4v1750169028779!5m2!1sen!2sin",
  "Hope Island": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3526.7515022287416!2d153.36373437619247!3d-27.87890287608466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b9113e3125d880f%3A0xa7e514b46fa94c4e!2sSimply%20Hearing%20%7C%20Hearing%20Aids%20%7C%20Ear%20Wax%20Cleaning!5e0!3m2!1sen!2sin!4v1750169091898!5m2!1sen!2sin"
};

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  selectedReason,
  selectedLocation,
  selectedDate,
  selectedTimeSlot,
  isBookingComplete = false,
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

  const getMapEmbedUrl = (locationName: string): string | null => {
    return locationMaps[locationName] || null;
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-4">
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
                selectedReason || isBookingComplete ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedReason || isBookingComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Service Selected</span>
            </div>
            <div
              className={`flex items-center space-x-2 text-sm ${
                selectedLocation || isBookingComplete ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedLocation || isBookingComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Location Selected</span>
            </div>
            <div
              className={`flex items-center space-x-2 text-sm ${
                selectedTimeSlot || isBookingComplete ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  selectedTimeSlot || isBookingComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Time Selected</span>
            </div>
            <div 
              className={`flex items-center space-x-2 text-sm ${
                isBookingComplete ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full ${
                  isBookingComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
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
            <div className="flex items-start space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                <p className="text-sm text-gray-600">{selectedLocation.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatLocationAddress(selectedLocation)}
                </p>
                {selectedLocation.phoneNumber && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Phone className="h-3 w-3"/> {selectedLocation.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            {getMapEmbedUrl(selectedLocation.name) ? (
              <div className="w-full h-36 rounded border overflow-hidden">
                <iframe
                  src={getMapEmbedUrl(selectedLocation.name)!}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${selectedLocation.name}`}
                />
              </div>
            ) : (
              <div className="h-32 bg-gray-100 rounded border flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Map integration</p>
                  <p className="text-xs text-gray-500">coming soon</p>
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
};