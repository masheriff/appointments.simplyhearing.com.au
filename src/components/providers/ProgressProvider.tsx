// ===================================================================
// src/components/ProgressProvider.tsx
// ===================================================================
'use client';

import React, { useEffect } from 'react';
import { ProgressProvider as BProgressProvider, useProgress } from '@bprogress/react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

// Internal component that handles the progress logic
const ProgressController: React.FC = () => {
  const { start, stop } = useProgress();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    const isLoading = isFetching > 0 || isMutating > 0;
    
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isFetching, isMutating, start, stop]);

  return null; // This component doesn't render anything
};

// Main provider component
interface ProgressProviderProps {
  children: React.ReactNode;
  height?: string;
  color?: string;
  options?: {
    showSpinner?: boolean;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleSpeed?: number;
    minimum?: number;
  };
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
  height = "3px",
  color = "#2563eb", // Blue-600
  options = {
    showSpinner: false,
    easing: "ease",
    speed: 500,
    trickle: true,
    trickleSpeed: 200,
    minimum: 0.1,
  },
}) => {
  return (
    <BProgressProvider 
      height={height} 
      color={color} 
      options={options}
    >
      <ProgressController />
      {children}
    </BProgressProvider>
  );
};