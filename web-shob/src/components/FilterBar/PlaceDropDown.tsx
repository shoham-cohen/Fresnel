import type { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ARENA_LABELS } from '@/constants/arena.constant';

interface PlaceDropDownProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export const PlaceDropDown: FC<PlaceDropDownProps> = ({ selectedLocation, onLocationChange }) => (
  <FormControl size="small" fullWidth>
    <InputLabel id="place-label">מיקום</InputLabel>
    <Select
      labelId="place-label"
      value={selectedLocation}
      label="מיקום"
      onChange={(e) => onLocationChange(e.target.value ? e.target.value : 'הכל')}
    >
      <MenuItem value="הכל">
          הכל
      </MenuItem>
      {Object.entries(ARENA_LABELS).map(([key, value]) => (
        <MenuItem key={key} value={key}>
          {value}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);