import type jwt from 'jsonwebtoken';

export interface ITokenPayload extends jwt.JwtPayload {
  id: string
}
