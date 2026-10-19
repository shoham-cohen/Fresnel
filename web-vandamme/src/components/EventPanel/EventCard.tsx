import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, Divider } from '@mui/material';

// Icons 
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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

export default function EventCard() {
  const white = '#ffffff';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        height: '100%',
        width: '100%',
        dir: 'rtl', 
      }}
    >
      {/* Right Box: Event Info */}
      <Item 
        sx={{ 
          flex: 1, 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: 3 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: white, mb: 3 }}>
          כותרת האירוע
        </Typography>

        <Box sx={{ width: '100%',textAlign: 'right' , mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold',color: white }}>
            זיהוי האירוע
          </Typography>
          <Typography sx={{ variant: "body2", color: "text.secondary" }}>
            10.04.2026 | 12:34
          </Typography>
        </Box>

        <Box sx={{ width: '100%',textAlign: 'right' , mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold',color: white }}>
            עדכון אחרון
          </Typography>
          <Typography sx={{ variant: "body2", color: "text.secondary" }}>
            10.04.2026 | 12:34
          </Typography>
        </Box>
      </Item>

      {/* Middle Box: Stats */}
      <Item 
        sx={{ 
          flex: 1, 
          flexDirection: 'column', 
          p: 2 
        }}
      >
        {/* Top Stat */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: white }}>
            <DescriptionOutlinedIcon fontSize="small" />
            <Typography variant="body1">סה״כ פרסומים</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: white, mt: 1 }}>
            2,546
          </Typography>
        </Box>

        <Divider sx={{ width: '70%', my: 1 }} />

        {/* Bottom Stat */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: white }}>
            <VisibilityOutlinedIcon fontSize="small" />
            <Typography variant="body1">סה״כ צפיות</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: white, mt: 1 }}>
            63,232
          </Typography>
        </Box>
      </Item>

      {/* Left Box: Sources */}
      <Item 
        sx={{ 
          flex: 1, 
          flexDirection: 'column', 
          justifyContent: 'center',
          p: 2 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: white, mb: 3 }}>
          <LocalFireDepartmentOutlinedIcon fontSize="medium" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            מקורות עיקריים
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: white, mb: 1.5 }}>
          instagram
        </Typography>
        <Typography variant="body1" sx={{ color: white, mb: 1.5 }}>
          twitter
        </Typography>
        <Typography variant="body1" sx={{ color: white }}>
          ynet
        </Typography>
      </Item>
    </Box>
  );
}