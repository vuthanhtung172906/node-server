import { NextFunction, Response } from 'express';
import { IReqAuth, IDecodedToken } from './../config/interface';
import jwt from 'jsonwebtoken';
import User from '../models/useModel';
const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Invalid Token when Bla' });
    const decode = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`) as IDecodedToken;
    if (!decode) return res.status(400).json({ msg: 'Invalid Authentication' });
    const user = await User.findById(decode.id);
    if (!user) return res.status(400).json({ msg: 'User not exist' });
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
};

export default auth;
