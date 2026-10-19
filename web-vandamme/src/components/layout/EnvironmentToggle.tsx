
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEnvironment } from '../../Context/EnvironmentContext'
import { useEffect } from 'react'

type Environment = 'real' | 'simulation'

export default function EnvironmentToggle() {
  const { isSimulation, setIsSimulation } = useEnvironment()

  const value: Environment = isSimulation ? 'simulation' : 'real'

  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, newValue: Environment | null) => {
        if (newValue === null) return

        setIsSimulation(newValue === 'simulation')
      }}
      aria-label="בחירת סביבת עבודה"
      sx={{
        direction: 'rtl',
        height: 44,
        border: '1px solid #47678b',
        borderRadius: '24px',
        p: '3px',
        bgcolor: '#102b4c',

        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          borderRadius: '22px !important',
          minWidth: 105,
          px: 3,
          py: 1,
          color: '#fff',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'background-color 0.2s ease',

          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.12)',
          },

          '&.Mui-selected': {
            bgcolor: '#4b78ad',
            color: '#fff',
            fontWeight: 700,

            '&:hover': {
              bgcolor: '#6090c5',
            },
          },
        },
      }}
    >
      <ToggleButton value="simulation" aria-label="תרגילית">
        תרגילית
      </ToggleButton>

      <ToggleButton value="real" aria-label="אמת">
        אמת
      </ToggleButton>
    </ToggleButtonGroup>
  )
}