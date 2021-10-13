import { Router } from 'express';
import auth from '../middleware/auth';

import useCtr from '../controllers/userCtr';
const router = Router();

router.post('/register', useCtr.register);
router.post('/active', useCtr.activeAccount);
router.post('/login', useCtr.login);
router.get('/logout', useCtr.logout);
router.post('/refreshtoken', useCtr.refreshToken);
router.patch('/editprofile', auth, useCtr.changeInfoUser);
router.post('/googlelogin', useCtr.googleLogin);
export default router;
