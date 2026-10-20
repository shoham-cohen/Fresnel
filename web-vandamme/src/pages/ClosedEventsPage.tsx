import { Typography , Box , TextField , InputAdornment } from "@mui/material"
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ClosedEventsTable from "../components/ClosedEventsTable";

// VD-10: the closed events screen. Not built yet.
// It looks different from the open events screen in Figma, so it gets its own components.
export default function ClosedEventsPage() {

  const [value, setValue] = useState('');
  const [fromDate , setFromDate] = useState('');
  const [untilDate , setUntilDate] = useState('');

  return (
    <Box sx={{
      border: 2,
      borderColor: 'primary:main',
      borderRadius: 2,
      width: '100%',
      height: '100%',
      margin: 2 , 
      padding: 5,
    }}>
      <Box sx={{
        display: 'flex',
        gap: 2 , 
        alignItems: 'baseline'
      }}>
        <Typography sx={{ fontSize: '40px' , fontWeight: 'Bold' }}>אירועים שנסגרו</Typography>
        <Typography sx={{ fontWeight: 'Bold'}}>(124)</Typography>
      </Box>

      <Box sx={{
        padding: 5,
        display: 'flex',
        gap: 20,
        flexDirection: 'row'
      }}>
        <TextField
          placeholder="חפש..."
          value={value}
          size="small"
          onChange={(e) => setValue(e.target.value)}
          dir="rtl"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '40px' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: '20%',
            '& .MuiOutlinedInput-root': {
              height: '56px',
              borderRadius: 5,
            '& fieldset': { borderWidth: 2 },
            },
          }}
        />

      <Box sx={{
        display: 'flex',
        gap: 5
      }}>

        <TextField
        type="date"
        label= "מתאריך"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
        type="date"
        label= "עד תאריך"
        value={untilDate}
        onChange={(e) => setUntilDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        />

      </Box>
    </Box>

    <ClosedEventsTable />

    </Box>
  )
}