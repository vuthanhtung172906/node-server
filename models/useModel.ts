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
      type: String,
      default:
        'https://res.cloudinary.com/tungvuthanh20172906/image/upload/v1629169689/user/rgjzatwvrzfrqjpmz7po.jpg',
    },
    type: {
      type: String,
      default: 'register',
    },
  },
  {
    timestamps: true,
  }
);
export default model<IUser>('User', userSchema);
