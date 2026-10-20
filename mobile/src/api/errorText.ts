import { ERROR_TEXT } from '@/constants/labels';

import { ApiError } from './client';

export function errorText(error: unknown, byStatus: Partial<Record<number, string>> = {}): string {
  if (error instanceof ApiError) {
    const text = byStatus[error.status];
    if (text) return text;
    if (error.status === 0) return ERROR_TEXT.network;
  }
  return ERROR_TEXT.generic;
}
