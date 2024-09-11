import {Router} from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
// router.get('/api/v1/auth/reset-token', AuthController.resetToken);

export default router;
