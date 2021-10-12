import { NextFunction, Response } from 'express';
import Payments from '../models/paymentModel';
import { IReqAuth } from './../config/interface';
const payment = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const { name, phone, address, cart, typePay, total } = req.body;
    const newPayment = {
      name_id: req.user?._id,
      name: name,
      phone: phone,
      email: req.user?.email,
      address,
      cart,
      typePay,
      total,
    };
    const newpayment = new Payments(newPayment);
    await newpayment.save();
    req.payment = newpayment;
    next();
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
};

export default payment;
