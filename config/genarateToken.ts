import { sign } from 'jsonwebtoken';

export const generateActiveToken = (payload: object) => {
  return sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`);
};
export const generateAccessToken = (payload: object) => {
  return sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`);
};
export const generateRefreshToken = (payload: object) => {
  return sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`);
};
