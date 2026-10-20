import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useSearchParams } from 'react-router';

import { useReality } from '@/hooks';
import type { Reality } from '@/types';
import { clearSelectionParams } from '@/features/narratives/constants';

import { styles } from './RealityToggle.styles';

export type { Reality };

const options: readonly { value: Reality; label: string }[] = [
  { value: 'real', label: 'אמת' },
  { value: 'exercise', label: 'תרגילית' },
];

export function RealityToggle() {
  const { reality, setReality } = useReality();
  const [, setSearchParams] = useSearchParams();

  const handleChange = (next: Reality) => {
    if (next === reality) return;

    setReality(next);
    setSearchParams(clearSelectionParams, { replace: true });
  };

  return (
    <Box role="radiogroup" aria-label="מציאות" sx={styles.track}>
      {options.map((option) => {
        const isSelected = reality === option.value;
        return (
          <ButtonBase
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => {
              handleChange(option.value);
            }}
            sx={styles.option(isSelected)}
          >
            {option.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
