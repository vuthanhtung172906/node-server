import { Router } from 'express';
import paymentCtr from '../controllers/paymentCtr';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';
import payment from '../middleware/payment';
const router = Router();
router.post('/request', auth, payment, paymentCtr.paymentRequest);
router.patch('/status', auth, authAdmin, paymentCtr.editStatus);
router.get('/order_history', auth, paymentCtr.getOrderHistory);
router.post('/createPayPaid', auth, payment, paymentCtr.createPayPaid);
router.get('/getAllOrder', auth, authAdmin, paymentCtr.getAllOrder);
export default router;
