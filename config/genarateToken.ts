import { sign } from 'jsonwebtoken';

export const generateActiveToken = (payload: object) => {
  return sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, { expiresIn: '5m' });
};
export const generateAccessToken = (payload: object) => {
  return sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '1h' });
};
export const generateRefreshToken = (payload: object) => {
  return sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '24h' });
};
