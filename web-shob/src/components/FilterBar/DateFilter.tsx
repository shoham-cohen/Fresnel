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
}) => (
  <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
    <TextField
      type="date"
      label="מתאריך"
      value={startDate}
      onChange={(e) => onStartDateChange(e.target.value)}
      size="small"
      fullWidth
      slotProps={{
            inputLabel: {
              shrink: true,
            }
          }}
    />
    <TextField
      type="date"
      label="עד תאריך"
      value={endDate}
      onChange={(e) => onEndDateChange(e.target.value)}
      size="small"
      fullWidth
      slotProps={{
            inputLabel: {
              shrink: true,
            }
          }}
    />
  </Box>
);