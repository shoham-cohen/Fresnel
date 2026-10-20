import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  CircularProgress,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useActionTypes } from '../hooks/useActionTypes'

const MAX_CHARS = 500

type Props = {
  open: boolean
  onClose: () => void
}

export default function AddActionModal({ open, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { actionTypes, loading, error } = useActionTypes(open)

  const handleSubmit = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="rtl"
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          p: 1,
          direction: 'rtl',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 2,
          pb: 1,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: 'text.primary' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px' }}>
          הוספת פעולה
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography
              component="label"
              sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '14px' }}
            >
              כותרת לפעולה <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <FormControl fullWidth size="small" error={!!error}>
              <Select
                value={title}
                onChange={(e: SelectChangeEvent) => setTitle(e.target.value)}
                displayEmpty
                disabled={loading || !!error}
                MenuProps={{ dir: 'rtl' }}
                endAdornment={
                  loading ? (
                    <CircularProgress size={18} sx={{ position: 'absolute', left: 32 }} />
                  ) : null
                }
                sx={{
                  '& .MuiSelect-select.MuiSelect-outlined': {
                    color: title ? 'text.primary' : 'text.secondary',
                    paddingRight: '14px',
                    paddingLeft: '32px',
                  },
                  '& .MuiSelect-icon': {
                    right: 'auto',
                    left: 7,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  {loading ? 'טוען...' : 'בחר כותרת לפעולה...'}
                </MenuItem>
                {actionTypes.map((item) => (
                  <MenuItem key={item.code} value={item.labelHe}>
                    {item.labelHe}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </Box>

          <Box>
            <Typography
              component="label"
              sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '14px' }}
            >
              תיאור קצר <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setDescription(e.target.value)
                }
              }}
              placeholder="הזן תיאור קצר של מה שבוצע.."
              sx={{
                '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'left' }}
            >
              {description.length}/{MAX_CHARS}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 1,
              bgcolor: '#13293d',
              color: '#fff',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#white',
                boxShadow: 'none',
              },
            }}
          >
            הוסף פעולה
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}