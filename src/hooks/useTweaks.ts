import { useState, useCallback } from 'react';
import type { Tweaks } from '../types';

export function useTweaks(defaults: Tweaks) {
  const [tweaks, setTweaks] = useState<Tweaks>(defaults);

  const setTweak = useCallback((key: keyof Tweaks, value: any) => {
    setTweaks((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return [tweaks, setTweak] as const;
}
