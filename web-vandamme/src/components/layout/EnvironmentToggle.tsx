
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEnvironment } from '../../Context/EnvironmentContext'

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
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: '24px',
        p: '3px',
        bgcolor: 'background.paper',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',

        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          borderRadius: '22px !important',
          minWidth: 105,
          px: 3,
          py: 1,
          color: 'text.primary',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'background-color 0.2s ease, color 0.2s ease',

          '&:hover': {
            bgcolor: 'action.hover',
          },

          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'background.default',
            fontWeight: 700,

            '&:hover': {
              bgcolor: 'primary.dark',
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