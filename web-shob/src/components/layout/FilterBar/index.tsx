import { type FC } from 'react';
import { Paper, Box } from '@mui/material';
import { SearchBar } from './SearchBar';
import { DateFilter } from './DateFilter';
import { PlaceDropDown } from './PlaceDropDown';

export interface FilterBarProps {
  searchTerm: string;
  startDate: string;
  endDate: string;
  selectedLocation: string;
  onSearchChange: (value: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onLocationChange: (locations: string[]) => void;
}

export const FilterBar: FC<FilterBarProps> = ({
  searchTerm,
  startDate,
  endDate,
  selectedLocation,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onLocationChange
}) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      mb: 3,
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      flexWrap: 'wrap',
      backgroundColor: '#ffffff',
      borderRadius: 2,
    }}
  >
    <Box sx={{ flex: 1, minWidth: '200px' }}>
      <SearchBar 
        value={searchTerm} 
        onChange={onSearchChange} 
      />
    </Box>

    <Box sx={{ flex: 2, minWidth: '300px' }}>
      <DateFilter 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </Box>

    <Box sx={{ flex: 1, minWidth: '150px' }}>
      <PlaceDropDown 
        selectedLocation={selectedLocation} 
        onLocationChange={onLocationChange} 
      />
    </Box>
  </Paper>
);