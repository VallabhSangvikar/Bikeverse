import { Router } from 'express';
import { BikeController } from '../controllers/bike.controller';
import { authMiddleware, roleCheck } from '../middleware/auth.middleware';

const router = Router();
const bikeController = new BikeController();

// Public routes
router.get('/search', bikeController.search.bind(bikeController));
router.get('/:id', bikeController.getById.bind(bikeController));

// Protected routes
router.use(authMiddleware);

// Seller routes
router.post('/', roleCheck(['seller']), bikeController.create.bind(bikeController));
router.put('/:id', roleCheck(['seller']), bikeController.update.bind(bikeController));
router.delete('/:id', roleCheck(['seller']), bikeController.delete.bind(bikeController));

export default router;
