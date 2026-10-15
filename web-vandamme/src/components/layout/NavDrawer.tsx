import type { ReactNode } from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'

const DRAWER_WIDTH = 240

export type NavItem<Id extends string> = {
  id: Id
  label: string
  icon: ReactNode
}

type Props<Id extends string> = {
  items: readonly NavItem<Id>[]
  selected: Id
  onSelect: (id: Id) => void
}

export default function NavDrawer<Id extends string>({ items, selected, onSelect }: Props<Id>) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItemButton key={item.id} selected={item.id === selected} onClick={() => onSelect(item.id)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}
