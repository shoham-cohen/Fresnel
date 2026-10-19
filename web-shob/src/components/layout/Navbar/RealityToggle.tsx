import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import type { Reality } from '@/types';

import { styles } from './RealityToggle.styles';

export type { Reality };

const options: readonly { value: Reality; label: string }[] = [
  { value: 'real', label: 'אמת' },
  { value: 'exercise', label: 'תרגילית' },
];

/**
 * Switches between real and exercise data. Figma: mainPage › reality (132:63).
 *
 * TODO: the choice is local only. Lift it up (or into context) once the data
 * layer needs to know which reality is selected.
 */
export function RealityToggle() {
  const [reality, setReality] = useState<Reality>('real');

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
