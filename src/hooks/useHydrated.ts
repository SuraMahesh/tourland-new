import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// false during static prerendering and the hydration render, true right after.
// Use it to defer browser-only UI without a hydration mismatch.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
