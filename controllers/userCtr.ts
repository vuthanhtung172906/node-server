import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { google } from 'googleapis';
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.MAIL_CLIENT_ID);
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../config/genarateToken';
import { IDecodedToken, IUser } from '../config/interface';
import sendEmail from '../config/sendMail';
import jwt from 'jsonwebtoken';
import Users from '../models/useModel';
import { TokenPayload } from 'google-auth-library';
const CLIENT_URL = `${process.env.BASE_URL}`;
const useCtr = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'Email already register' });
      const passwordHash = await hash(password, 12);
      const newUser = { name: username, email, password: passwordHash };
      console.log({ newUser });
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
      console.log(req.body);
      const { activetoken } = req.body;
      const decode = jwt.verify(activetoken, `${process.env.ACTIVE_TOKEN_SECRET}`) as IDecodedToken;
      const { newUser } = decode;
      console.log(decode);
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
      res.clearCookie('refreshtoken', {
        path: '/api/refreshtoken',
        domain: 'localhost',
      });
      console.log('log out success');
      return res.json({ msg: 'Log out success' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      console.log({ rf_token });
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });
      const decode = jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`) as IDecodedToken;
      if (!decode.id) return res.status(400).json({ msg: 'Invalid Token' });
      const user = await Users.findById(decode.id).select('-password');
      if (!user) return res.status(400).json({ msg: 'Account not exist' });

      const access_token = generateAccessToken({ id: user.id });
      res.json({ access_token, user });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  changeInfoUser: async (req: any, res: Response) => {
    try {
      const { avatar, username, password } = req.body;
      console.log(req.body);
      if (password !== '') {
        const passwordHash = await hash(password, 12);
        await Users.findByIdAndUpdate(req.user._id, {
          password: passwordHash,
          name: username,
          avatar: avatar,
        });
      } else {
        await Users.findByIdAndUpdate(req.user._id, {
          name: username,
          avatar: avatar,
        });
      }
      res.status(200).json({ msg: 'Change profile success !' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.body;
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });
      const { email_verified, name, picture, email } = verify.getPayload() as TokenPayload;
      const paswordhash = await hash(email as string, 12);
      if (!email_verified) return res.status(400).json({ msg: 'Email verification failed.' });
      const user = await Users.findOne({ email });
      if (user) {
        const isMatch = await compare(email as string, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' });
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
      } else {
        const newUser = new Users({
          name: name,
          email: email,
          password: paswordhash,
          avatar: {
            public_id: '',
            url: picture,
          },
        });
        await newUser.save();
        const access_token = generateAccessToken({ id: newUser._id });
        const refresh_token = generateRefreshToken({ id: newUser._id });

        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/api/refreshtoken',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
          msg: 'Login Success',
          access_token,
          user: {
            ...newUser._doc,
            password: '',
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
};

export default useCtr;
