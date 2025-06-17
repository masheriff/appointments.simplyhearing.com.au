// ===================================================================
// src/hooks/utils/useLoadingState.ts
// ===================================================================
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const useLoadingState = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  return {
    isLoading: isFetching > 0 || isMutating > 0,
    isFetching: isFetching > 0,
    isMutating: isMutating > 0,
    activeQueries: isFetching,
    activeMutations: isMutating,
  };
};