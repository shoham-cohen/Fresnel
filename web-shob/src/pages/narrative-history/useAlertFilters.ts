import type { Narrative } from '@/interfaces/narrative.interface';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

export const useNarrativeFilters = (nerratives: Narrative[]) => {
  const [params, setParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(params.get('q') || '');
  const [startDate, setStartDate] = useState(params.get('startDate') || '');
  const [endDate, setEndDate] = useState(params.get('endDate') || '');
  const [location, setLocation] = useState(params.get('location') || 'הכל');

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set('q', searchTerm);
    if (startDate) searchParams.set('startDate', startDate);
    if (endDate) searchParams.set('endDate', endDate);
    if (location !== 'הכל') searchParams.set('location', location);
    setParams(searchParams, { replace: true });
  }, [searchTerm, startDate, endDate, location, setParams]);

  const filteredAlerts = useMemo(() => {
    return nerratives.filter(item => {
      const matchSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLoc = location === 'הכל' || item.arena.includes(location);
      const itemTime = new Date(item.detectedAt).getTime();
      const matchStart = !startDate || itemTime >= new Date(startDate).getTime();
      const matchEnd = !endDate || itemTime <= new Date(endDate).setHours(23, 59, 59, 999);
      
      return matchSearch && matchLoc && matchStart && matchEnd;
    });
  }, [nerratives, searchTerm, startDate, endDate, location]);

  const handleLocationChange = useCallback((newLocation: string) => setLocation(newLocation || 'הכל'), []);

  return {
    searchTerm, startDate, endDate, selectedLocation: location,
    setSearchTerm, setStartDate, setEndDate, setSelectedLocation: handleLocationChange,
    filteredAlerts
  };
};