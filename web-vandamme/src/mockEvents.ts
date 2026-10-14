export type EventSummary = {
  id: string
  title: string
  openedAt: string
}

// Mock data until the API is wired up
export const MOCK_EVENTS: EventSummary[] = [
  { id: 'evt-1', title: 'שמועה על פיצוץ בנמל חיפה', openedAt: '12:34' },
  { id: 'evt-2', title: 'סרטון מזויף של חיילים בגבול הצפון', openedAt: '11:27' },
  { id: 'evt-3', title: 'קמפיין בוטים נגד משרד הבריאות', openedAt: '10:15' },
  { id: 'evt-4', title: 'ציוץ ויראלי על הפסקת חשמל ארצית', openedAt: '08:42' },
  { id: 'evt-5', title: 'מסמך מודלף מזויף בטלגרם', openedAt: '08:12' },
  { id: 'evt-6', title: 'האשטאג מתגבר ברשתות בערבית', openedAt: '07:56' },
  { id: 'evt-7', title: 'דיווח שקרי על חטיפה בדרום', openedAt: '06:33' },
  { id: 'evt-8', title: 'תמונה ערוכה מהפגנה בתל אביב', openedAt: '05:21' },
]
