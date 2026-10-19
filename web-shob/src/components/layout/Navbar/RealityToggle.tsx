import { useState } from 'react';

import styles from './RealityToggle.module.css';
import type { Reality } from '@/types';

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
    <div role="radiogroup" aria-label="מציאות" className={styles.track}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={reality === option.value}
          className={styles.option}
          onClick={() => {
            setReality(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
