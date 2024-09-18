import {Router} from 'express';
import authRouter from './authRoutes.js';
import usersRouter from './usersRoutes.js';
import postRouter from './postsRoutes.js';



const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postRouter);

export default router;
