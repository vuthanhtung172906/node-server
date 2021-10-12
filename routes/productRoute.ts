import { Router } from 'express';
import productCtr from '../controllers/productCtr';

const router = Router();

router.get('/', productCtr.getProducts);
router.post('/', productCtr.createProduct);
router.patch('/:id', productCtr.updateProduct);
router.delete('/:id', productCtr.deleteProduct);
router.get('/:id', productCtr.getProductDetail);
export default router;
