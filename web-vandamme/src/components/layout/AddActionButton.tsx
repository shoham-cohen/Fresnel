import { useState } from "react";
import { Button, Typography } from "@mui/material";
import AddActionModal from "../AddActionModal";

export default function AddActionButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
        <Button
                variant="outlined"
                onClick={() => setIsModalOpen(true)}
                sx={{
                    width: '50%',
                    margin: 2,
                    height: '70px',
                  border: 2,
                  borderColor: 'background.paper',
                  color: "white",
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Typography sx={{ fontSize: '17px'}}>+ הוספת פעולה</Typography>
              </Button>
        
              <AddActionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}