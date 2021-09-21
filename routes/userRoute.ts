import { Router } from 'express';
import useCtr from '../controllers/userCtr';
const router = Router();

router.post('/register', useCtr.register);
router.post('/active', useCtr.activeAccount);
router.post('/login', useCtr.login);
router.get('/logout', useCtr.logout);
router.get('/refreshtoken', useCtr.refreshToken);

export default router;
