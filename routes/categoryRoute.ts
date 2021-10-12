import { Router } from 'express';
import categoryCtr from '../controllers/categoryCtr';
import authAdmin from '../middleware/authAdmin';
import auth from '../middleware/auth';
const router = Router();

router.get('/', categoryCtr.getCategory);
router.post('/', auth, authAdmin, categoryCtr.createCategory);
router.delete('/:id', auth, authAdmin, categoryCtr.deleteCategory);
router.patch('/:id', auth, authAdmin, categoryCtr.updateCategory);

export default router;
