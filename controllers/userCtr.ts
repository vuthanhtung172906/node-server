import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../config/genarateToken';
import { IDecodedToken } from '../config/interface';
import sendEmail from '../config/sendMail';
import jwt from 'jsonwebtoken';
import Users from '../models/useModel';
const CLIENT_URL = `${process.env.BASE_URL}`;
const useCtr = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'Email already register' });
      const passwordHash = await hash(password, 12);
      const newUser = { name, email, password: passwordHash };
      const active_token = generateActiveToken({ newUser });
      const url = `${CLIENT_URL}/active/${active_token}`;
      sendEmail(email, url, 'Verify your email');

      return res.json({ msg: 'Success! Please check your email.' });
    } catch (err) {
      return res.status(500).json({ msg: (err as Error).message });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      const decode = jwt.verify(
        active_token,
        `${process.env.ACTIVE_TOKEN_SECRET}`
      ) as IDecodedToken;
      const { newUser } = decode;
      if (!newUser) return res.status(400).json({ msg: 'Invalid Autehntication' });
      const user = new Users(newUser);
      await user.save();
      res.json({ msg: 'Account has been actived' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'This account does not exist ' });
      const isMatch = await compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect ' });
      const access_token = generateAccessToken({ id: user._id });
      const refresh_token = generateRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refreshtoken',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({
        msg: 'Login Success',
        access_token,
        user: {
          ...user._doc,
          password: '',
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie('refreshtoken', { path: '/api/refreshtoken' });
      return res.json({ msg: 'Log out success' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });
      const decode = jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`) as IDecodedToken;
      if (!decode.id) return res.status(400).json({ msg: 'Please login' });
      const user = await Users.findById(decode.id).select('-password');
      if (!user) return res.status(400).json({ msg: 'Account not exist' });

      const access_token = generateAccessToken({ id: user.id });
      res.json({ access_token });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
};

export default useCtr;