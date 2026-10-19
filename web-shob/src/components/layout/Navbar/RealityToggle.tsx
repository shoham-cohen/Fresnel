import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { useReality } from '@/hooks';
import type { Reality } from '@/types';

import { styles } from './RealityToggle.styles';

export type { Reality };

const options: readonly { value: Reality; label: string }[] = [
  { value: 'real', label: 'אמת' },
  { value: 'exercise', label: 'תרגילית' },
];

export function RealityToggle() {
  const { reality, setReality } = useReality();

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
              setReality(option.value);
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
