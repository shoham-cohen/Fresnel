import type { ReactNode } from 'react'
import { Box, Paper } from '@mui/material'

type Props = {
  list: ReactNode
  children: ReactNode // the detail pane
}

// A list on the right and the selected item's pane next to it.
export default function ListDetailLayout({ list, children }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
      <Box sx={{ width: 360, flexShrink: 0 }}>{list}</Box>
      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          textAlign: 'center',
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}
