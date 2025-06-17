import { useState, useEffect, useCallback } from 'react';
import { 
  getAppointmentReasons, 
  getLocations,
  getBookableLocations,
  getTimeSlots,
  bookAppointment
} from '@/services/appointmentService';
import type{ 
  AppointmentReason, 
  Location, 
  TimeSlot, 
  TimeSlotsParams,
  BookAppointmentRequest,
  BookedAppointment
} from '@/types/api';

// Cache for static data that doesn't change often
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const staticDataCache = new Map<string, CacheEntry<unknown>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generic hook for API calls with caching
export const useApiCall = <T>(
  apiFunction: () => Promise<T>, 
  cacheKey?: string
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first if cacheKey is provided
    if (cacheKey) {
      const cached = staticDataCache.get(cacheKey) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
      
      // Cache the result if cacheKey is provided
      if (cacheKey) {
        staticDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Specific hooks for each API with caching
export const useAppointmentReasons = () => {
  return useApiCall<AppointmentReason[]>(getAppointmentReasons, 'appointment-reasons');
};

export const useLocations = () => {
  return useApiCall<Location[]>(getLocations, 'locations');
};

export const useBookableLocations = () => {
  return useApiCall<Location[]>(getBookableLocations, 'bookable-locations');
};

export const useTimeSlots = (params: TimeSlotsParams | null) => {
  const [data, setData] = useState<TimeSlot[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSlots = useCallback(async (timeSlotsParams: TimeSlotsParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTimeSlots(timeSlotsParams);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params) {
      fetchTimeSlots(params);
    } else {
      setData(null);
      setError(null);
    }
  }, [params, fetchTimeSlots]);

  const refetch = useCallback(() => {
    if (params) {
      fetchTimeSlots(params);
    }
  }, [params, fetchTimeSlots]);

  return { 
    data, 
    loading, 
    error, 
    refetch: params ? refetch : undefined 
  };
};

// Hook for booking appointments
export const useBookAppointment = () => {
  const [data, setData] = useState<BookedAppointment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const bookAppointmentAsync = useCallback(async (bookingData: BookAppointmentRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);

    try {
      const result = await bookAppointment(bookingData);
      setData(result);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book appointment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    success,
    bookAppointment: bookAppointmentAsync,
    reset
  };
};