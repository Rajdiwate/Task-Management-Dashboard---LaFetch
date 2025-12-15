// hooks/useDebounce.ts
import { useCallback, useRef, useEffect } from 'react';

export const useDebounce = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number = 500,
) => {
  const timeoutRef = useRef<number | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: TArgs) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return debouncedCallback;
};
