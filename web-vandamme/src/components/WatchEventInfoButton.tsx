import { Button , Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function WatchEventInfoButton() {
    return (
        <Button sx={{
            display: 'flex',
            gap: 2,
            border: 1,
            borderRadius: 2,
            padding: 2,
            paddingLeft: 4,
            paddingRight:4
        }}>
            <VisibilityIcon />
            <Typography sx={{ fontSize: '17px'}}>צפייה בפרטי האירוע</Typography>
        </Button>
    )
}