import { useContext } from 'react';

import { RealityContext, type RealityContextType } from '@/contexts/RealityContext';

export function useReality(): RealityContextType {
  const context = useContext(RealityContext);

  if (!context) {
    throw new Error('useReality must be used within a RealityProvider');
  }

  return context;
}

