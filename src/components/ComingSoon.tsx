// src/components/ComingSoon.tsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Get next Monday
  const getNextMonday = () => {
    const today = new Date();
    const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7; // 1 = Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(9, 0, 0, 0); // 9 AM launch time
    return nextMonday;
  };

  const launchDate = getNextMonday();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-full bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Simply Hearing Appointment Booking
          </p>
          <p className="text-lg text-gray-500">
            Your convenient online booking system for hearing consultations
          </p>
        </div>

        {/* Launch Date */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg inline-block">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-6 w-6 text-[#D1AA6D]" />
            <span className="text-lg font-semibold text-gray-700">Launch Date</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDate(launchDate)}
          </p>
          <p className="text-sm text-gray-500 mt-1">9:00 AM AEST</p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-[#D1AA6D]" />
            <h2 className="text-2xl font-bold text-gray-800">Time Remaining</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl md:text-4xl font-bold text-[#D1AA6D] mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Need Immediate Assistance?
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="tel:+61422388005" 
              className="flex items-center gap-3 bg-[#D1AA6D] hover:bg-[#B8945C] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>+61 422 388 005</span>
            </a>
            
            <a 
              href="mailto:info@simplyhearing.com.au" 
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>info@simplyhearing.com.au</span>
            </a>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Easy Booking",
              description: "Book your hearing consultation in just a few clicks"
            },
            {
              title: "Flexible Scheduling",
              description: "Choose from available time slots that work for you"
            },
            {
              title: "Expert Care",
              description: "Professional audiology services with experienced practitioners"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};