import {  useState, type ReactNode } from 'react'
import { Box, Paper } from '@mui/material'
import EventPanel from '../EventPanel'
import type { EventSummary } from '../../api/events'

type Props = {
  selectedEvent?: EventSummary 
  list: ReactNode
  children: ReactNode // the detail pane
}

// A list on the right and the selected item's pane next to it.
export default function ListDetailLayout({ list, children, selectedEvent }: Props) {

  return (
    <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0, height: '100%' }}>
       <Box sx={{ width: 360, flexShrink: 0 }}>{list}</Box> 
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minHeight: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 0,
        }}
      >

        {selectedEvent ? <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
         <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
            <EventPanel  />
          </Box>
        </Box> : <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
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
      </Box>}
      </Paper>
    </Box>
  )
}
