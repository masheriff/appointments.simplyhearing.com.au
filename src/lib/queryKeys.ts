// ===================================================================
// src/lib/queryKeys.ts - Centralized Query Key Management
// ===================================================================
import type { TimeSlotsParams } from '@/types/api';

export const queryKeys = {
  // Static data (longer cache times)
  appointmentReasons: {
    all: ['appointment-reasons'] as const,
    byCategory: (category: string) => ['appointment-reasons', 'category', category] as const,
    byType: (type: string) => ['appointment-reasons', 'type', type] as const,
  },
  
  locations: {
    all: ['locations'] as const,
    active: ['locations', 'active'] as const,
    bookable: ['locations', 'bookable'] as const,
    byId: (id: string) => ['locations', 'byId', id] as const,
  },
  
  // Dynamic data (shorter cache times)
  timeSlots: {
    all: ['time-slots'] as const,
    byParams: (params: TimeSlotsParams) => ['time-slots', params] as const,
  },
  
  // User-specific data
  appointments: {
    all: ['appointments'] as const,
    byId: (id: string) => ['appointments', id] as const,
  },
} as const;