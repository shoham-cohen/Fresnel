import type { FC } from 'react';
import { Box, TextField } from '@mui/material';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateFilter: FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const fields = [
    { label: 'מתאריך', value: startDate, onChange: onStartDateChange },
    { label: 'עד תאריך', value: endDate, onChange: onEndDateChange },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      {fields.map(({ label, value, onChange }) => (
        <TextField
          key={label}
          type="date"
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        />
      ))}
    </Box>
  );
};