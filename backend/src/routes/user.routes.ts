import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, roleCheck } from '../middleware/auth.middleware';
import { validateUser } from '../middleware/validation.middleware';

const router = Router();
const userController = new UserController();

router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validateUser, userController.updateProfile);
router.get('/users', authMiddleware, roleCheck(['admin']), userController.getAll);

export default router;
