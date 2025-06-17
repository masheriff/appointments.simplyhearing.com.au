// src/components/booking/ProgressStep.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { BookingStep } from '@/types/booking';

interface ProgressStepProps {
  step: BookingStep;
  currentStep: BookingStep;
  title: string;
  icon: React.ElementType;
  isBookingComplete?: boolean;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({ 
  step, 
  currentStep, 
  title, 
  icon: Icon,
  isBookingComplete = false
}) => {
  const stepOrder = ['service', 'location', 'time', 'details'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(step);
  
  // If booking is complete, all steps should be marked as completed
  const isCompleted = isBookingComplete || stepIndex < currentIndex;
  const isCurrent = !isBookingComplete && step === currentStep;
  
  return (
    <div className="flex items-center">
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
        ${isCompleted ? 'bg-[#D1AA6D] border-[#D1AA6D] text-white' : 
          isCurrent ? 'bg-black border-black text-white' : 'border-gray-300 text-gray-400'}
      `}>
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <span className={`ml-3 text-sm font-medium ${
        isCompleted ? 'text-[#D1AA6D]' : 
        isCurrent ? 'text-black' : 'text-gray-500'
      }`}>
        {title}
      </span>
    </div>
  );
};