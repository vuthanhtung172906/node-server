import { model, Schema } from 'mongoose';
import { IUser } from '../config/interface';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    avatar: {
      type: Object,
      default: {
        public_id: 'nextjsapp/axop8adonhtwyamqibyw',
        url: 'https://res.cloudinary.com/tungvuthanh20172906/image/upload/v1633445875/nextjsapp/axop8adonhtwyamqibyw.jpg',
      },
    },
    order: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
export default model<IUser>('User', userSchema);
