// ===================================================================
// src/hooks/utils/usePageProgress.ts
// ===================================================================
import { useProgress } from '@bprogress/react';
import { useCallback } from 'react';

export const usePageProgress = () => {
  const { start, stop, pause, resume } = useProgress();

  const startProgress = useCallback((message?: string) => {
    if (message) {
      console.log(message);
    }
    start();
  }, [start]);

  const stopProgress = useCallback(() => {
    stop();
  }, [stop]);

  const pauseProgress = useCallback(() => {
    pause();
  }, [pause]);

  const resumeProgress = useCallback(() => {
    resume();
  }, [resume]);

  return {
    start: startProgress,
    stop: stopProgress,
    pause: pauseProgress,
    resume: resumeProgress,
  };
};