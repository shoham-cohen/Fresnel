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
  Button,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// מערך Mock עבור כותרות הפעולה בדרופ-דאון
const MOCK_ACTION_TITLES = [
  'עדכון סטטוס אירוע',
  'שיחה עם גורם מוסמך',
  'שליחת דיווח ראשוני',
  'בדיקת נתונים בשטח',
  'סגירת מעגל טיפול',
]

type Props = {
  open: boolean
  onClose: () => void
}

export default function AddActionModal({ open, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const MAX_CHARS = 500

  const handleSubmit = () => {
    console.log({ title, description })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      {/* כותרת הפופ-אפ וכפתור סגירה */}
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
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px'}}>
          הוספת פעולה
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.primary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* כותרת לפעולה - דרופ דאון מבוסס Select ו-FormControl */}
          <Box>
            <Typography component="label" sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '14px', textAlign: 'right' }}>
              כותרת לפעולה <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={title}
                onChange={(e: SelectChangeEvent) => setTitle(e.target.value)}
                displayEmpty
                sx={{
                  textAlign: 'right',
                  '& .MuiSelect-select': {
                    color: title ? 'text.primary' : 'text.secondary',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  הזן כותרת לפעולה...
                </MenuItem>
                {MOCK_ACTION_TITLES.map((item) => (
                  <MenuItem key={item} value={item} sx={{ direction: 'rtl' }}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* תיאור קצר */}
          <Box>
            <Typography component="label" sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '14px', textAlign: 'right' }}>
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
                '& .MuiOutlinedInput-root': {
                  alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                  textAlign: 'right',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'left' }}>
              {description.length}/{MAX_CHARS}
            </Typography>
          </Box>

          {/* כפתור הוסף פעולה תחתון */}
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
                bgcolor: '#0d1d2b',
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