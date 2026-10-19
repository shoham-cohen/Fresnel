import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import EventCard from './EventPanel/EventCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


export default function EventPanel( ) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: '100%',
        width: '100%',
        m: 0,
        flexGrow: 1,
      }}
    >

      <Grid size={3} sx={{ height: '100%' }}>
        <Item>1</Item>
      </Grid>
      <Grid size={6} sx={{ height: '100%' }}>
         <Grid size={12} sx={{ height: '15%' }}>
        <EventCard></EventCard>
      </Grid>
      <Grid size={12} sx={{ height: '85%',  paddingTop:3}}>
        <Item>6</Item>
      </Grid>
      </Grid>
      <Grid size={3} sx={{ height: '100%' }}>
        <Grid size={12} sx={{ height: '40%'  }}>
        <Item>3</Item>
      </Grid>
      <Grid size={12} sx={{ height: '60%', paddingTop:1}}>
        <Item>4</Item>
      </Grid>
      </Grid>
      
    </Grid>
  );
}
