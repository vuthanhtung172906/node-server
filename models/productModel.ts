import { IProduct } from './../config/interface';
import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Array,
      default: [],
    },
    color: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    inStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Partial<IProduct>>('Product', productSchema);
