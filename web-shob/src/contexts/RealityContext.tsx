import { createContext, useState, type ReactNode } from 'react';

import type { Reality } from '@/types';

export type RealityContextType = {
  reality: Reality;
  setReality: (reality: Reality) => void;
};

export interface RealityProviderProps {
  children: ReactNode;
  initialReality?: Reality;
}

export const RealityContext = createContext<RealityContextType | undefined>(undefined);

export function RealityProvider({ children, initialReality = 'real' }: RealityProviderProps) {
  const [reality, setReality] = useState<Reality>(initialReality);

  return (
    <RealityContext.Provider value={{ reality, setReality }}>{children}</RealityContext.Provider>
  );
}
