// src/components/booking/ProgressStep.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { BookingStep } from '@/types/booking';

interface ProgressStepProps {
  step: BookingStep;
  currentStep: BookingStep;
  title: string;
  icon: React.ElementType;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({ 
  step, 
  currentStep, 
  title, 
  icon: Icon 
}) => {
  const stepOrder = ['service', 'location', 'time', 'details'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(step);
  
  const isCompleted = stepIndex < currentIndex;
  const isCurrent = step === currentStep;
  
  return (
    <div className="flex items-center">
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
        ${isCompleted ? 'bg-black border-black text-white' : 
          isCurrent ? 'border-black text-black' : 'border-gray-300 text-gray-400'}
      `}>
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <span className={`ml-3 text-sm font-medium ${isCurrent ? 'text-black' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
};