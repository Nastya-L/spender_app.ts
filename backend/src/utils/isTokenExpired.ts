import type { IToken } from '../models/UserSchema.js';

const isTokenExpired = (token: IToken, days: number): boolean => {
  const now = new Date();
  const creationDate = new Date(token.time);
  const expirationDate = new Date(creationDate.getTime() + days * 24 * 60 * 60 * 1000);
  return now > expirationDate;
};

export default isTokenExpired;
