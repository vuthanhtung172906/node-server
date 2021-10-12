import { Request } from 'express';
import { Document } from 'mongoose';

export interface INewUser {
  name: string;
  email: string;
  password: string;
}
export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  order: Array<any>;
  type: string;
  _doc: object;
}
export interface IDecodedToken {
  id?: string;
  newUser?: INewUser;
  iat: number;
  exp: number;
}
export interface IReqAuth extends Request {
  user?: IUser;
  payment?: IPayment;
}

export interface IReqFile extends Request {
  files?: any;
}

export interface IProduct {
  _id?: String;
  title: String;
  price: Number;
  description: String;
  content: String;
  images: Array<Object>;
  category: String;
  inStock: Number;
  checked?: Boolean;
  sold?: Number;
  color?: string[];
  capacity?: string[];
}

export interface IPayment {
  name_id: string;
  name: string;
  email: string;
  address: string;
  cart: IProduct[];
  total: Number;
  typePay: string;
  status?: Boolean;
  _id?: string;
}
