import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  onConfirm,
  onCancel,
  title = 'מחיקת פעולה',
  message = 'האם אתה בטוח שאתה רוצה למחוק את הפעולה?',
  loading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      dir="rtl"
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title" sx={{ fontWeight: 'bold', color: '#fff' }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-delete-description" sx={{ color: '#fff' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1, justifyContent: 'flex-start' }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          autoFocus
        >
          כן
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255, 255, 255, 0.08)' },
          }}
        >
          לא
        </Button>
      </DialogActions>
    </Dialog>
  );
}