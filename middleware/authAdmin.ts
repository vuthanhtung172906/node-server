import { NextFunction, Response } from 'express';
import { IReqAuth } from '../config/interface';

const authAdmin = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user?.role === 'user') {
      return res.status(400).json({ msg: 'Access deny' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
};

export default authAdmin;
