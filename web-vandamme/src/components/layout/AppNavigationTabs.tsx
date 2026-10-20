import { Box, Button } from '@mui/material'
import type { PageId } from '../../App'

type Props = {
  page: PageId
  onSelect: (page: PageId) => void
}

const NAV_TABS: { id: PageId; label: string }[] = [
  { id: 'open', label: 'אירועים פעילים' },
  { id: 'closed', label: 'אירועים שנסגרו' },
]

export default function AppNavigationTabs({ page, onSelect }: Props) {
  return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', gap: 1 }}>
      {NAV_TABS.map((tab) => {
        const isActive = page === tab.id
        return (
          <Button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            sx={{
              position: 'relative',
              color: isActive ? 'text.primary' : 'text.secondary',
              fontWeight: isActive ? 700 : 500,
              fontSize: '15px',
              textTransform: 'none',
              py: 2,
              px: 2,
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'action.hover',
              },
              ...(isActive && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  bgcolor: 'common.white', 
                },
              }),
            }}
          >
            {tab.label}
          </Button>
        )
      })}
    </Box>
  )
}