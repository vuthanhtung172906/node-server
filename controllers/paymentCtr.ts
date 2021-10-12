import Payments from '../models/paymentModel';
import querystring from 'query-string';
import crypto from 'crypto';
import { IReqAuth } from '../config/interface';
import { Response } from 'express';
import dateTime from 'date-and-time';
function sortObject(obj: any) {
  var sorted: any = {};
  var str: Array<any> = [];
  var key: any;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
const paymentCtr = {
  paymentRequest: async (req: IReqAuth, res: Response) => {
    try {
      const date = new Date();
      const createDate = dateTime.format(date, 'YYYYMMDDHHmmss');
      const secretKey = 'LOUSLBDSZHSWBBVPAMOGMWDZHHHADWSY';
      let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: 'TE1AU40S',
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: dateTime.format(date, 'HHmmss'),
        vnp_OrderInfo: req.payment?._id,
        vnp_OrderType: 200001,
        vnp_Amount: (req.payment?.total as number) * 100,
        vnp_ReturnUrl: 'http://localhost:3000/order/payment_result',
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: createDate,
      };
      const vnp_Params = sortObject(params);
      var signData = querystring.stringify(vnp_Params, { encode: false });
      var hmac = crypto.createHmac('sha512', secretKey);
      var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      return res.json({ msg: vnpUrl });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  editStatus: async (req: IReqAuth, res: Response) => {
    try {
      const { paymentID, status } = req.body;
      if (status === '00') {
        await Payments.findByIdAndUpdate(paymentID, {
          status: true,
        });
      } else {
        await Payments.findByIdAndUpdate(paymentID, {
          status: false,
        });
      }
      return res.json({ msg: 'Thay đổi thành công' });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  getOrderHistory: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?.id;
      const paymentlist = await Payments.find({
        name_id: userId,
      });
      return res.json(paymentlist);
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  createPayPaid: async (req: IReqAuth, res: Response) => {
    try {
      return res.json({
        msg: 'Đặt hàng thành công. Vui lòng kiểm tra lại trong lịch sử đơn hàng',
      });
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
  getAllOrder: async (req: IReqAuth, res: Response) => {
    try {
      const paymentlist = await Payments.find({});
      return res.json(paymentlist);
    } catch (error) {
      return res.status(500).json({ msg: (error as Error).message });
    }
  },
};
export default paymentCtr;
