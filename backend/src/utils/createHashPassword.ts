import { createHash } from 'crypto';

export const createHashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};
