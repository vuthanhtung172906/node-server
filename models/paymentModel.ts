import { model, Schema } from 'mongoose';
import { IPayment } from '../config/interface';

const paymentSchema = new Schema(
  {
    name_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    cart: {
      type: Array,
      require: true,
    },
    total: {
      type: Number,
      require: true,
    },
    typePay: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IPayment>('Payments', paymentSchema);
