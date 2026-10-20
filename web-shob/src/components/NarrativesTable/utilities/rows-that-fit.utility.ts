import { TABLE_HEAD_HEIGHT, TABLE_ROW_HEIGHT } from '../constants/columns.constant';

export const rowsThatFit = (height: number): number => {
  return Math.max(1, Math.floor((height - TABLE_HEAD_HEIGHT) / TABLE_ROW_HEIGHT));
};
