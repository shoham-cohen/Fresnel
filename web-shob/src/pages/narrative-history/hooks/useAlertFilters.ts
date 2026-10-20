import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export const useAlertFilters = (rawAlerts: any[]) => {
  const [params, setParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(params.get('q') || '');
  const [startDate, setStartDate] = useState(params.get('startDate') || '');
  const [endDate, setEndDate] = useState(params.get('endDate') || '');
  const [location, setLocation] = useState(params.get('location') || 'הכל');

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync to URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedSearch) p.set('q', debouncedSearch);
    if (startDate) p.set('startDate', startDate);
    if (endDate) p.set('endDate', endDate);
    if (location !== 'הכל') p.set('location', location);
    setParams(p, { replace: true });
  }, [debouncedSearch, startDate, endDate, location, setParams]);

  // Client-side filtering
  const filteredAlerts = useMemo(() => {
    return rawAlerts.filter(item => {
      const matchSearch = !debouncedSearch || item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchLoc = location === 'הכל' || item.location === location;
      const itemTime = new Date(item.createdAt).getTime();
      const matchStart = !startDate || itemTime >= new Date(startDate).getTime();
      const matchEnd = !endDate || itemTime <= new Date(endDate).setHours(23, 59, 59, 999);
      
      return matchSearch && matchLoc && matchStart && matchEnd;
    });
  }, [rawAlerts, debouncedSearch, startDate, endDate, location]);

  const handleLocationChange = useCallback((locs: string[]) => setLocation(locs[0] || 'הכל'), []);

  return {
    searchTerm, startDate, endDate, selectedLocation: location,
    setSearchTerm, setStartDate, setEndDate, setSelectedLocation: handleLocationChange,
    filteredAlerts
  };
};