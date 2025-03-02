import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, roleCheck } from '../middleware/auth.middleware';
import { validateUser } from '../middleware/validation.middleware';

const router = Router();
const userController = new UserController();

router.post('/register', validateUser, userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/profile', authMiddleware, userController.getProfile.bind(userController));
router.put('/profile', authMiddleware, validateUser, userController.updateProfile.bind(userController));
router.get('/users', authMiddleware, roleCheck(['admin']), userController.getAll.bind(userController));

// Admin routes for verification
router.get(
    '/pending-verifications',
    authMiddleware,
    roleCheck(['admin']),
    userController.getPendingVerifications.bind(userController)
);

router.post(
    '/verify-user',
    authMiddleware,
    roleCheck(['admin']),
    userController.verifyUser.bind(userController)
);

export default router;
