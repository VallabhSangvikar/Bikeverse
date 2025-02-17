import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware, roleCheck } from '../middleware/auth.middleware';
import { validateProduct } from '../middleware/validation.middleware';

const router = Router();
const productController = new ProductController();

router.post('/', authMiddleware, roleCheck(['seller', 'admin']), validateProduct, productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', authMiddleware, roleCheck(['seller', 'admin']), validateProduct, productController.update);
router.delete('/:id', authMiddleware, roleCheck(['seller', 'admin']), productController.delete);

export default router;
