// Display names come from Miraj, which has no contract yet. Until it does, the names are the
// mock API users (GET /api/mock/users). Screens read names only through this hook, so switching
// to Miraj changes this file alone.
const USER_NAMES: Record<string, string> = {
  'ben.natanzon': 'בן נתנזון',
  'shahar.tzabari': 'שחר צברי',
  'eden.tolkin': 'עדן טולקין',
  'noa.hershko': 'נועה הרשקו',
};

/** The user's display name, or the id when the name is unknown. */
export function useUserName(userId: string): string {
  return USER_NAMES[userId] ?? userId;
}
