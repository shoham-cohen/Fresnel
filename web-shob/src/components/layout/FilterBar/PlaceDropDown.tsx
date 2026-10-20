import { type FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

interface PlaceDropDownProps {
  selectedLocation: string;
  onLocationChange: (location: string[]) => void;
}

const PLACE_OPTIONS = [
  { label: 'הכל', value: '' },
  { label: 'גבול הצפון', value: 'North' },
  { label: 'גבול הדרום', value: 'South' },
];

export const NotificationHistoryPlaceDropDown: FC<PlaceDropDownProps> = ({
  selectedLocation,
  onLocationChange,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onLocationChange(value ? [value] : []);
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="place-dropdown-label">מיקום</InputLabel>
      <Select
        labelId="place-dropdown-label"
        value={selectedLocation}
        label="מיקום"
        onChange={handleChange}
      >
        {PLACE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};