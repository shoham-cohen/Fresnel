import type { FC } from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => (
  <TextField
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="חפש..."
    size="small"
    fullWidth
  />
);