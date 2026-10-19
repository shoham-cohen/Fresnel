import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

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

export default function EventPanel() {
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
      <Grid size={8} sx={{ height: '50%' }}>
        <Item>size=8</Item>
      </Grid>
      <Grid size={4} sx={{ height: '50%' }}>
        <Item>size=4</Item>
      </Grid>
      <Grid size={4} sx={{ height: '50%' }}>
        <Item>size=4</Item>
      </Grid>
      <Grid size={8} sx={{ height: '50%' }}>
        <Item>size=8</Item>
      </Grid>
    </Grid>
  );
}
